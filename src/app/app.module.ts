import { SubscriptionComponent } from './wampdemo/subscription.component';
import { JWampService } from './services/jwamp.service';
import { WampDemoComponent } from './wampdemo/wampdemo.component';
import { WampSetupComponent } from './wampsetup/wampsetup.component';
import { ProcedureComponent } from './wampdemo/procedure.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { MsglistComponent } from 'app/wampdemo/msglist.component';

const appRoutes: Routes = [
  { path: '', component: WampSetupComponent },
  { path: 'demo', component: WampDemoComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MsglistComponent,
    WampSetupComponent,
    WampDemoComponent,
    ProcedureComponent,
    SubscriptionComponent
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
