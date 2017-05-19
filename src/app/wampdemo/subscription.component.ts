import { MsglistComponent, MessageProvider } from 'app/wampdemo/msglist.component';
import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnDestroy {
  @Input()
  name: string;

  log = new MessageProvider();

  publishPayload = 'Ping';

  conns = new Subscription();

  constructor(public wampService: JWampService) {
  }

  ngOnDestroy() {
    this.conns.unsubscribe();
  }

  subscribe() {
    this.conns.add(this.wampService.jwamp.subscribe(this.name).subscribe(
      payload => {
        if (payload) {
          this.log.info('Received: ' + payload[0]);
        } else {
          this.log.info('Subscribed');
        }
      },
      e => this.log.error('Subscription error: ' + e)));
  }

  publish() {
    this.wampService.jwamp.publish(this.name, [this.publishPayload])
      .then(() => {
        this.log.message('Published');
      })
      .catch(e => {
        this.log.error('Publish error: ' + e);
      });
  }
}
