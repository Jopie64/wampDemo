import { MsglistComponent, MessageProvider } from 'app/wampdemo/msglist.component';
import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnDestroy {
  @Input()
  name: string;

  @Output()
  onClose = new EventEmitter<void>();

  log = new MessageProvider();

  returnPayload = 'You called me';
  callPayload = 'Hey';

  conns = new Subscription();

  constructor(public wampService: JWampService) {
  }

  ngOnDestroy() {
    this.conns.unsubscribe();
  }

  register() {
    this.conns.add(this.wampService.jwamp$
      .flatMap(w => w.register(this.name, payload => {
        this.log.message('Called: ' + payload.argsList[0]);
        return { argsList: [this.returnPayload] };
      })).subscribe(
        registered => this.log.info(registered ? 'Registered' : 'Not registered'),
        e => this.log.error('Registration error: ' + e.error)));
  }

  call() {
    this.wampService.jwamp$.take(1)
      .flatMap(w => w.call(this.name, { argsList: [this.callPayload]}))
      .map(a => a.argsList[0])
      .subscribe(result => {
          this.log.message('Call response: ' + result);
        },
        e => {
          this.log.error('Unable to call. ' + e);
        });
   }

   close() {
     this.onClose.emit();
   }
}
