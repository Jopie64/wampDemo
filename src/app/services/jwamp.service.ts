import { Injectable } from '@angular/core';
import { makeJWamp, JWamp, JWampProxyFactory, JWampProxy } from 'jwamp';

@Injectable()
export class JWampService {
  public jwamp: JWampProxy;
  public url = 'ws://40.86.85.83:443/ws';
  public realm = 'realm1';

  constructor() {
    this.setWampData(this.url, this.realm);
  }

  setWampData(url: string, realm: string)  {
    this.url = url;
    this.realm = realm;
    this.jwamp = makeJWamp(url, realm)
      .makeProxyFactory('demo')
      .makeProxy(0);
  }
}
