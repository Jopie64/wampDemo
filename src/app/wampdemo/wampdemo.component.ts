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
  public wampState$: Observable<string> = new BehaviorSubject('Please setup WAMP first');

  procedures: string[] = ['Proc1', 'Proc2'];

  constructor(public wampService: JWampService) {
  }

  ngOnInit() {
    if (this.wampService.jwamp) {
      console.log('Wamp initialized. Monitoring...');
      this.wampState$ = this.wampService.jwamp.isConnected$
        .do(connected => console.log('State: ' + connected))
        .map((connected): string => connected ? 'Verbonden' : 'Niet verbonden');
    } else {
      console.log('Wamp not initialized...');
    }
  }

  addProcedure(name: string) {
    this.procedures.push(name);
  }
}
