import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Component, Injectable, OnInit, Input, EventEmitter, Output } from '@angular/core';



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
      .flatMap(v => Observable.onErrorResumeNext<string>(
        v.wamp.callProgress(this.rpc, { argsList: [v.input] })
          .map(out => out.argsList[0] as string)
          .do(
            out => this.output = out,
            e => this.output = 'Error: ' + e),
        Observable.from([v.input])))
      .subscribe(v => this.onOutput.emit(v));
  }
}
