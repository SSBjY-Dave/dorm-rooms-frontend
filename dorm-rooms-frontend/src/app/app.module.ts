import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReservationComponent } from './reservation/reservation.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { DormService } from './dorm.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ReservationComponent,
    InfoBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    DormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
