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
  public wampState$: BehaviorSubject<string> = new BehaviorSubject('Please setup WAMP first');

  procedures: string[] = ['Procedure1'];
  subscriptions: string[] = ['Subscription1'];

  constructor(public wampService: JWampService) {
  }

  ngOnInit() {
    if (this.wampService.jwamp) {
      console.log('Wamp initialized. Monitoring...');
      this.wampState$.next('Wamp Connected');
    } else {
      console.log('Wamp not initialized...');
    }
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
