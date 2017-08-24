import { Injectable } from '@angular/core';
import { makeJWamp, JWampProxy } from './jwamp';
import { Subscription, Subject } from 'rxjs/Rx';

@Injectable()
export class JWampService {
  public jwamp: JWampProxy;
  public url = 'ws://40.86.85.83:443/ws';
  public realm = 'realm1';
  public onNewWampData$ = new Subject();

  private conns = new Subscription();

  constructor() {
    this.onNewWampData$.asObservable()
      .map(() => ({url: this.url, realm: this.realm}))
      .switchMap(v => makeJWamp(v.url, v.realm)
        .retryWhen(v => v.timeout(2000)))
      .map(v => v.makeProxy('', false))
      .subscribe(v => this.jwamp = v);
    this.setWampData(this.url, this.realm);
  }

  setWampData(url: string, realm: string)  {
    this.url = url;
    this.realm = realm;
    this.onNewWampData$.next();
  }
}
