import { Observable, ReplaySubject, Subscription } from 'rxjs/Rx';
import { Wampy, WampyOptions } from 'wampy/src/wampy';

interface JWampArgs {
    argsList?: any[];
    argsDict?: any;
}

export interface JWampRpcRsp extends JWampArgs {
    options?: any;
}

export interface JWampPayload extends JWampArgs {
    details?: any;
}

export interface JWampError extends JWampPayload {
    error?: string;
    details?: string;
}

interface WampyRpcPayload extends JWampPayload {
    result_handler: (payload: JWampPayload) => void;
    error_handler: (e: JWampError) => void;
}

export type JWampRpc = (payload: JWampPayload) => JWampRpcRsp | Promise<JWampRpcRsp> | Observable<JWampRpcRsp>;

interface JWampProxyBase {
  lifetime$: Observable<void>;

  register(uri: string, rpc: JWampRpc): Observable<void>;
  call(uri: string, payload?: JWampPayload): Promise<JWampPayload>;
  callProgress(uri: string, payload?: JWampPayload): Observable<JWampPayload>;
  subscribe(uri: string): Observable<any>;
  publish(topic: string, payload?: any): Promise<void>;

  makeProxy(prefix: string, hasOwnLifetime: boolean): JWampProxy;
}

interface JWampProxy extends JWampProxyBase {
    value$<T>(valueChangeUri: string): Observable<T>;
    onNewObject$(rootProxy: JWampProxy, newObjectUri: string): Observable<JWampProxy>;
}

type WampyMaker = (url: string, options: WampyOptions) => Wampy;

function extendProxy(baseProxy: JWampProxyBase): JWampProxy {
    function value$<T>(valueChangeUri: string): Observable<T> {
        return baseProxy.subscribe(valueChangeUri)
            .skip(1)
            .map(newVal => <T>newVal[0])
            .publishReplay(1).refCount();
    }

    function onNewObject$(rootProxy: JWampProxy, newObjectUri: string) {
        return baseProxy.subscribe(newObjectUri)
            .skip(1)
            .map(i => i[0])
            .map(objId => rootProxy.makeProxy(objId + '.', true));
    }

    return Object.assign(baseProxy, {
        value$: value$,
        onNewObject$: onNewObject$
    });
}

function makeProxyLifetime(proxy: JWampProxyBase): Observable<void> {
    return Observable.create(observer => {
        const subscription = new Subscription;

        const completeIt = () => {
            subscription.unsubscribe();
            observer.complete();
        };

        subscription.add(proxy.subscribe('End').skip(1).subscribe(completeIt));
        proxy.call('Initialize')
            .then(args => args[0])
            .then(initOk => {
                if (initOk) {
                    // Object is alive.
                    observer.next();
                    return;
                }
                console.log('Initialization failure. Object was already gone.');
                completeIt();
            })
            .catch(e => {
                observer.error(new Error(`Unable to initialize: ${e}`));
                subscription.unsubscribe();
            });
        return () => {
            subscription.unsubscribe();
            proxy.call('End').catch(_ => {}); // Ignore errors
        };
    });
}

function makeProxyFromProxy(origProxy: JWampProxyBase, prefix: string, hasOwnLifetime: boolean): JWampProxy {
    function formatUri(name: string): string {
        return prefix + name;
    }

    const proxyBase = {
        register: (uri: string, rpc: JWampRpc) => origProxy.register(formatUri(uri), rpc),
        call: (uri: string, payload?: JWampPayload) => origProxy.call(formatUri(uri), payload),
        callProgress: (uri: string, payload?: JWampPayload) => origProxy.callProgress(formatUri(uri), payload),
        subscribe: (uri: string) => origProxy.subscribe(formatUri(uri)),
        publish: (uri: string, payload?: any ) => origProxy.publish(formatUri(uri), payload),
    };

    const proxy = Object.assign(proxyBase, {
        lifetime$: hasOwnLifetime ? makeProxyLifetime(<JWampProxyBase>proxyBase).shareReplay() : origProxy.lifetime$,
        makeProxy: makeProxyFromProxy.bind(null, <JWampProxyBase>proxyBase)
    });

    return extendProxy(proxy);
}

function makeProxyFromWampy(wampy: Wampy, wampyLifetime: Observable<void>): JWampProxy {

    function toCallPayload(payload?: JWampPayload) {
        if (payload) {
            if (payload.argsList) {
                return payload.argsList;
            }
            if (payload.argsDict) {
                return payload.argsDict;
            }
        }
        return null;
    }

    function call(uri: string, payload?: JWampPayload): Promise<JWampPayload> {
        return new Promise<JWampPayload>(function (resolve, reject) {
            wampy.call(uri, toCallPayload(payload), {
                onSuccess: (args: JWampPayload) => { console.log(args); resolve(args); },
                onError: (err) => { reject(err); }
            });
        });
    }

    function callProgress(uri: string, payload?: JWampPayload): Observable<JWampPayload> {
        return Observable.create(observer => {
            wampy.call(uri, toCallPayload(payload), {
                onSuccess: (args: JWampPayload) => {
                    console.log(args);
                    if (args.argsList || args.argsDict) {
                        observer.next(args);
                    }
                    if (!args.details || !args.details.progress) {
                        observer.complete();
                    }
                },
                onError: (err) => observer.error(err)
            });
        });
    }


    function subscribe(uri: string): Observable<any> {
      return Observable.create(observer => {
        wampy.subscribe(uri, {
            onSuccess: () => observer.next(), // First event indicates success
            onError: (error) => observer.error(error),
            onEvent: (arrayPayload, objectPayload) => observer.next(arrayPayload)
          });
        return () => wampy.unsubscribe(uri);
      });
    }

    function register(uri: string, rpc: JWampRpc): Observable<void> {
      return Observable.create(observer => {
        console.log('Registering ' + uri);
        function myRpc(payload: WampyRpcPayload) {
            const rsp = rpc(payload);
            if (rsp instanceof Observable) {
                return new Promise((resolve, reject) => {
                    rsp.subscribe(
                        // Next sends intermediate values
                        n => payload.result_handler(Object.assign(n, { options: { progress: true }})),
                        // Error rejects the promise
                        reject,
                        // Complete event resolves the promise with
                        resolve);
                });
            }
            console.log('Non progressive responses...');
            return rsp;
        }
        wampy.register(uri, {
            rpc: myRpc,
            onSuccess: () => observer.next(true),
            onError: e => observer.error(e)
            });
        return () => wampy.unregister(uri);
      });
    }

    function publish(topic: string, payload?: any): Promise<void> {
        return new Promise<void>(function (resolve, reject) {
            wampy.publish(topic, payload, {
                onSuccess: () => { resolve(); },
                onError: (err) => { reject(err); }
            });
        });
    }

    const proxy = {
        lifetime$: wampyLifetime,
        register: register,
        call: call,
        callProgress: callProgress,
        subscribe: subscribe,
        publish: publish,
        makeProxy: (prefix: string, hasOwnLifetime: boolean) => makeProxyFromProxy(proxy, prefix, hasOwnLifetime)
    };

    return extendProxy(proxy);
}

const makeJWamp = function (url: string, realm: string, wampyMaker?: WampyMaker): Observable<JWampProxy> {
  const useWampyMaker = wampyMaker ? wampyMaker : (url: string, options: WampyOptions) => new Wampy(url, options);
  return Observable.create(observer => {
    console.log('Creating wampy connection wrapper...');
    let isCompleted = false;
    const wampyLifetime = new ReplaySubject<void>();
    const myWampy = useWampyMaker(url, {
        realm: realm,
        onConnect: () => {
            console.log('Connected!');
            observer.next(makeProxyFromWampy(myWampy, wampyLifetime.asObservable()));
            wampyLifetime.next(undefined);
        },
        onError: () => {
            console.log('Error in wamp connection.');
            if (isCompleted) {
                return;
            }
            observer.error(new Error('Unable to connect'));
            isCompleted = true;
            wampyLifetime.complete();
        },
        onClose: () => {
            if (isCompleted) {
                return;
            }
            console.log('Disconnected...');
            observer.complete();
            isCompleted = true;
            wampyLifetime.complete();
        },
        autoReconnect: false,
        maxRetries: 0
        });
    return () => {
        console.log('Wampy is disposed');
        myWampy.disconnect();
    };
  });
};

export {
  JWampProxy,
  makeJWamp
}
