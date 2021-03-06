import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReservationComponent } from './reservation/reservation.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { ListPeopleComponent } from './list-people/list-people.component';
import { DormService } from './dorm.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditWindowComponent } from './edit-window/edit-window.component';
import { NotificationBoxComponent } from './notification-box/notification-box.component';
import { ReservationModifyComponent } from './reservation-modify/reservation-modify.component';
import { LabelWindowComponent } from './label-window/label-window.component';

@NgModule({
  declarations: [
    AppComponent,
    ReservationComponent,
    InfoBoxComponent,
    ListPeopleComponent,
    NotificationBoxComponent,
    EditWindowComponent,
    ReservationModifyComponent,
    LabelWindowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
