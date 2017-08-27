import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wampdemo',
  templateUrl: './wampdemo.component.html',
  styleUrls: ['./wampdemo.component.css']
})
export class WampDemoComponent implements OnInit {
  public wampState$: Observable<string>;

  procedures: string[] = ['Procedure1'];
  subscriptions: string[] = ['Subscription1'];

  constructor(public wampService: JWampService) {
    this.wampState$ = wampService.jwamp$
      .map(_ => 'Wamp initialized. Monitoring...')
      .startWith('Wamp not initialized. Please setup WAMP first');
  }

  ngOnInit() {
  }

  addProcedure(name: string) {
    this.procedures.push(name);
  }

  addSubscription(name: string) {
    this.subscriptions.push(name);
  }

  closeProcedure(name: string) {
    console.log('Closing procedure ' + name);
    this.procedures.splice(this.procedures.indexOf(name), 1);
  }

  closeSubscription(name: string) {
    console.log('Closing subscription ' + name);
    this.subscriptions.splice(this.subscriptions.indexOf(name), 1);
  }
}
