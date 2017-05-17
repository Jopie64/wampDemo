import { JWampService } from './services/jwamp.service';
import { WampDemoComponent } from './wampdemo/wampdemo.component';
import { WampSetupComponent } from './wampsetup/wampsetup.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: WampSetupComponent },
  { path: 'demo', component: WampDemoComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WampSetupComponent,
    WampDemoComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule
  ],
  providers: [JWampService],
  bootstrap: [AppComponent]
})
export class AppModule { }
