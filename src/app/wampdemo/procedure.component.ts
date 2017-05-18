import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent {
  @Input()
  name: string;

  constructor(public wampService: JWampService) {
  }

  register(){
    this.wampService.jwamp.register(this.name, payload => {
      console.log('Received command ' + this.name);
      console.log(payload);
      return [null, 'Received successfully'];
    })
    .then(() => console.log('Command ' + this.name + ' registered.'))
    .catch(e => {
        console.log('Unable to register ' + this.name + '. ' + e);
    });
  }

  call() {
    this.wampService.jwamp.call(this.name, ['Who you\'re gonna call?'])
      .then(result => {
        console.log('Response of call to ' + this.name);
        console.log(result);
      })
      .catch(e => {
        console.log('Unable to call ' + this.name + '. ' + e);
      });
   }
}
