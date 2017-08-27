import { Injectable } from '@angular/core';
import { makeJWamp, JWampProxy } from './jwamp';
import { Subscription, Subject, Observable } from 'rxjs/Rx';

@Injectable()
export class JWampService {
  public jwamp$: Observable<JWampProxy>;
//  public url = 'ws://40.86.85.83:443/ws';
  public url = 'ws://ws01.jdm1.maassluis:9001/wamp';
  public realm = 'jdm';
  public onNewWampData$ = new Subject();

  private conns = new Subscription();

  constructor() {
    this.jwamp$ = this.onNewWampData$.asObservable()
      .startWith('')
      .map(() => ({url: this.url, realm: this.realm}))
      .switchMap(v => makeJWamp(v.url, v.realm)
        .retryWhen(v => v.timeout(2000)))
      .map(v => v.makeProxy('nl.jdm.', false))
      .shareReplay(1);
    this.setWampData(this.url, this.realm);
  }

  setWampData(url: string, realm: string)  {
    this.url = url;
    this.realm = realm;
    this.onNewWampData$.next();
  }
}
