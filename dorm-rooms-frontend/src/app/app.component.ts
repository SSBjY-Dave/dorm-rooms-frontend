import {Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static messageEvent = new EventEmitter<string>();

  public uiSwitchEvent: EventEmitter<MainComponents> = new EventEmitter<MainComponents>();
  public mainComponent: MainComponents = MainComponents.RESERVATION;

  constructor() {
    this.uiSwitchEvent.subscribe(comp => this.mainComponent = comp);
  }
  title = 'dorm-rooms-frontend';
}
export enum MainComponents {
  LIST_PEOPLE, RESERVATION
}
