import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Component, Injectable, OnInit, Input, EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-whisperio',
  templateUrl: './io.component.html'
})
export class WhisperIoComponent {
    @Input()
    rpc: string;

    @Input()
    input: string;

    @Output()
    onOutput = new EventEmitter<string>();
}
