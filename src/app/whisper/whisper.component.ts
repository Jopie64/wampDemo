import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface IO {
  rpc: string;
  input$: Observable<string>;
  onOutput(output: string): void;
}

@Component({
  selector: 'app-whisper',
  templateUrl: './whisper.component.html'
})
export class WhisperComponent implements OnInit {

  public whisperInput = '';
  public whisper$ = new Subject<string>();
  public currentWhisper$: Observable<string>;
  public ios: IO[] = [];
  public finalOutput = '';

  constructor(public wampsvc: JWampService) {
    this.currentWhisper$ = this.whisper$.asObservable()
      .debounceTime(500);
  }

  ngOnInit(): void {
    this.addIo('Hello');
    this.addIo('World');
  }

  addIo(rpc: string) {
    let input$ = this.currentWhisper$;
    if (this.ios.length > 0) {
      const inputSubject = new Subject<string>();
      this.ios[this.ios.length - 1].onOutput = v => inputSubject.next(v);
      input$ = inputSubject.asObservable();
    }
    this.ios.push({
      rpc: rpc,
      input$: input$,
      onOutput: v => this.finalOutput = v
    });
  }

  onWhisperChange(v: string) {
    this.whisper$.next(v);
  }

  onNewOutput(e) {
    console.log('OnNewOutput(): ', e);
  }
}