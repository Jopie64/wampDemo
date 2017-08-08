import { Injectable } from '@angular/core';
import { makeJWamp, JWampProxy } from 'jwamp';
import { Subscription } from 'rxjs/Rx';

@Injectable()
export class JWampService {
  public jwamp: JWampProxy;
  public url = 'ws://40.86.85.83:443/ws';
  public realm = 'realm1';

  private conns = new Subscription();

  constructor() {
    this.setWampData(this.url, this.realm);
  }

  setWampData(url: string, realm: string)  {
    this.url = url;
    this.realm = realm;
    this.conns.add(makeJWamp(url, realm)
      .retryWhen(v => v.timeout(2000))
      .map(v => v.makeProxy('', false))
      .subscribe(v => this.jwamp = v));
  }
}
