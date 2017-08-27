import { Injectable } from '@angular/core';
import { makeJWamp, JWampProxy } from './jwamp';
import { Subscription, Subject, Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class JWampService {
  public jwamp$: Observable<JWampProxy>;
  public wampSettings$ = new BehaviorSubject({
//    url: 'ws://40.86.85.83:443/ws',
    url: 'ws://ws01.jdm1.maassluis:9001/wamp',
    realm: 'jdm'
  });

  private conns = new Subscription();

  constructor() {
    this.jwamp$ = this.wampSettings$.asObservable()
      .switchMap(v => makeJWamp(v.url, v.realm)
        .retryWhen(v => v.timeout(2000)))
      .map(v => v.makeProxy('nl.jdm.', false))
      .shareReplay(1);
  }

  setWampSettings(url: string, realm: string)  {
    this.wampSettings$.next({url: url, realm: realm});
  }
}
