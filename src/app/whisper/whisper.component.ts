import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-whisper',
  templateUrl: './whisper.component.html'
})
export class WhisperComponent implements OnInit {
    ngOnInit(): void {
    }
}