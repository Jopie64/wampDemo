import { MsglistComponent, MessageProvider } from 'app/wampdemo/msglist.component';
import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnDestroy {
  @Input()
  name: string;

  @Output()
  onClose = new EventEmitter<void>();

  log = new MessageProvider();

  publishPayload = 'Ping';

  conns = new Subscription();

  constructor(public wampService: JWampService) {
  }

  ngOnDestroy() {
    this.conns.unsubscribe();
  }

  subscribe() {
    this.conns.add(this.wampService.jwamp$
      .flatMap(w => w.subscribe(this.name))
      .subscribe(
        payload => {
          if (payload) {
            this.log.info('Received: ' + payload.argsList[0]);
          } else {
            this.log.info('Subscribed');
          }
        },
        e => this.log.error('Subscription error: ' + e)));
  }

  publish() {
    this.wampService.jwamp$
      .take(1)
      .flatMap(w => w.publish(this.name, { argsList: [this.publishPayload]}))
      .subscribe(
        () => {
          this.log.message('Published');
        },
        e => {
          this.log.error('Publish error: ' + e);
        });
  }

  close() {
     this.onClose.emit();
   }
}
