import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-whisper',
  templateUrl: './whisper.component.html'
})
export class WhisperComponent implements OnInit {

  public whisperInput = '';
  public whisper$ = new Subject<string>();
  public currentWhisper$: Observable<string>;
  public ios: string[] = ['Hello', 'World'];

  constructor() {
    this.currentWhisper$ = this.whisper$.asObservable()
      .debounceTime(1000);
  }

  ngOnInit(): void {
  }

  onWhisperChange(v: string) {
    this.whisper$.next(v);
  }

  onNewOutput() {
    console.log('OnNewOutput()');
  }
}