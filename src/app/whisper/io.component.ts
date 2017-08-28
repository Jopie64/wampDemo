import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Component, Injectable, OnInit, Input, EventEmitter, Output } from '@angular/core';

const logit = name => val => console.log(name + ':', val);

@Component({
  selector: 'app-whisperio',
  templateUrl: './io.component.html'
})
export class WhisperIoComponent implements OnInit {
  @Input()
  rpc: string;

  @Input()
  input: Observable<string>;

  @Output()
  onOutput = new EventEmitter<string>();

  public output = '';

  constructor(public wampsvc: JWampService) {
  }

  ngOnInit(): void {
    this.input
      .withLatestFrom(
        this.wampsvc.jwamp$,
        (input, wamp) => ({input: input, wamp: wamp}))
      .flatMap(v => v.wamp.callProgress(this.rpc, { argsList: [v.input] })
          .do(logit(this.rpc + '-callresult1'), logit(this.rpc + '-callresult1 error'))
          .map(out => out.argsList[0] as string)
          .do(logit(this.rpc + '-callresult2'), logit(this.rpc + '-callresult2 error'), () => logit(this.rpc + '-result2')('complete'))
          .do(
            out => this.output = out,
            e => this.output = 'Error: ' + e.error)
          .catch(e => [v.input])
          .do(logit(this.rpc + '-catch')))
      .do(logit('finalresult'), logit('finalresultError'))
      .subscribe(v => this.onOutput.emit(v));
  }
}
