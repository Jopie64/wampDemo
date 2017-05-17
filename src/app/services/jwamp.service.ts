import { Injectable } from '@angular/core';
import { makeJWamp, JWamp, JWampProxyFactory, JWampProxy } from 'jwamp';

@Injectable()
export class JWampService {
  public jwamp: JWampProxy;

  setWampData(url: string, realm: string)  {
    this.jwamp = makeJWamp(url, realm)
      .makeProxyFactory('demo')
      .makeProxy(0);
  }
}
