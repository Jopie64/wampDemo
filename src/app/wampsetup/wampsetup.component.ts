import { JWampService } from '../services/jwamp.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Component, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wampsetup',
  templateUrl: './wampsetup.component.html',
  styleUrls: ['./wampsetup.component.css']
})
export class WampSetupComponent {
  public wampSetupForm: FormGroup = this.fb.group({
    url: ['', Validators.required],
    realm: ['', Validators.required]
  });

  constructor(public wampService: JWampService, public fb: FormBuilder) {
    this.wampService.wampSettings$.take(1).subscribe(
      v => this.wampSetupForm.setValue(v));
  }

  onSubmit(e) {
    if (!this.wampSetupForm.valid) {
      console.log('Form not valid');
      return;
    }
    console.log('Configuring WAMP...');
    const wampSettings = this.wampSetupForm.value;
    console.log(wampSettings);
    this.wampService.setWampSettings(wampSettings.url, wampSettings.realm);
  }
}
