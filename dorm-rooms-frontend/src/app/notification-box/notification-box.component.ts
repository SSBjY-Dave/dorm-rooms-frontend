import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.css']
})
export class NotificationBoxComponent implements OnInit {

  constructor() { }

  private static NOTIFICATION_ANIMATION_TIME = 250;
  private static NOTIFICATION_HIDDEN_TIME: number = 50 + NotificationBoxComponent.NOTIFICATION_ANIMATION_TIME;
  private static NOTIFICATION_VISIBLE_TIME: number = 2000 + NotificationBoxComponent.NOTIFICATION_ANIMATION_TIME;
  public showNotification: boolean;
  public notificationMessage: string;

  private notificationList: string[] = [];
  private notificationAnimationActive = false;
  public animationPaused = false;

  ngOnInit(): void {
    AppComponent.messageEvent.subscribe(m => this.handleNewNotification(m));
  }

  handleNewNotification(message: string): void {
    this.notificationList.push(message);
    if (!this.notificationAnimationActive) { this.doNotificationAnimation(this); }
  }

  doNotificationAnimation(self: NotificationBoxComponent): void {
    const notificationElement = document.getElementsByClassName("notification-box")[0];
    if (self.notificationList.length === 0 && !self.showNotification) {
      self.notificationAnimationActive = false;
      setTimeout((notificationElement) => notificationElement.classList.add("invisible"), NotificationBoxComponent.NOTIFICATION_ANIMATION_TIME, notificationElement);
      return;
    }
    self.notificationAnimationActive = true;
    if (self.showNotification) {
      self.showNotification = false;
      setTimeout(self.doNotificationAnimation, NotificationBoxComponent.NOTIFICATION_HIDDEN_TIME, self);
    } else {
      if (!self.animationPaused) {
        self.notificationMessage = self.notificationList[0];
        self.notificationList = self.notificationList.slice(1);
        notificationElement.classList.remove("invisible");
        self.showNotification = true;
        setTimeout(self.doNotificationAnimation, NotificationBoxComponent.NOTIFICATION_VISIBLE_TIME, self);
      } else {
        setTimeout(self.doNotificationAnimation, 100, self);
      }
    }
  }

  pauseAnimation(): void {
    console.log("animation paused");
    this.animationPaused = true;
  }

  continueAnimation(): void {
    this.animationPaused = false;
  }
}
