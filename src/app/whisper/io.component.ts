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
    this.input.subscribe(v => this.sendOutput(`${this.rpc}-${v}-${this.rpc}`));
  }

  sendOutput(output: string) {
    this.output = output;
    this.onOutput.emit(output);
  }
}
