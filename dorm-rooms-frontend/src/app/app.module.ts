import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReservationComponent } from './reservation/reservation.component';
import { InfoBoxComponent } from './info-box/info-box.component';

@NgModule({
  declarations: [
    AppComponent,
    ReservationComponent,
    InfoBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
