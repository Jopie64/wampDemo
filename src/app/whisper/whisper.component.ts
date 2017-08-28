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
  public conns = new Subscription();

  constructor(public wampsvc: JWampService) {
    this.currentWhisper$ = this.whisper$.asObservable()
      .debounceTime(500);
  }

  ngOnInit(): void {
//    this.addIo('Hello');
//    this.addIo('World');
    this.conns.add(this.wampsvc.jwamp$
      .flatMap(w => w.subscribe('newWhisper'))
      .skip(1)
      .map(v => v.argsList[0])
      .subscribe(name => this.addIo(name)));
    this.wampsvc.jwamp$
      .flatMap(w => w.publish('discover'))
      .subscribe();
    }

  addIo(rpc: string) {
    if (this.ios.findIndex(io => io.rpc === rpc) >= 0) {
      console.log(`Rpc ${rpc} already defined`);
      this.whisper$.next(this.whisperInput);
      return;
    }
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
    this.whisper$.next(this.whisperInput);
  }

  onWhisperChange(v: string) {
    this.whisperInput = v;
    this.whisper$.next(v);
  }

  onNewOutput(e) {
    console.log('OnNewOutput(): ', e);
  }
}