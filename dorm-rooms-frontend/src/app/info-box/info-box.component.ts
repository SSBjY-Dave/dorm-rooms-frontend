import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {DormService, People} from '../dorm.service';
import {Subscription} from 'rxjs';
import {MainComponents} from '../app.component';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit, OnDestroy {
  @Input() uiSwitchEmitter: EventEmitter<MainComponents>;
  @Input() currentMainComponent: MainComponents;

  private dormService: DormService;
  private reloadDaemonSubscription: Subscription;
  private changeDetectorReference: ChangeDetectorRef;
  public person: People;

  constructor(changeDetectorReference: ChangeDetectorRef, dormService: DormService) {
    this.changeDetectorReference = changeDetectorReference;
    this.dormService = dormService;
  }

  private loadData(self: InfoBoxComponent): void {
    self.dormService.getCurrentPerson().subscribe(p => {
      self.person = Object.assign(new People(), p);
    });
  }

  ngOnInit(): void {
    this.loadData(this);
    this.reloadDaemonSubscription = this.dormService.reloadDaemonEvent.subscribe(_ => this.loadData(this));
  }

  ngOnDestroy(): void {
    this.reloadDaemonSubscription.unsubscribe();
  }

  switchUI(): void {
    if (this.currentMainComponent === MainComponents.RESERVATION) {
      this.uiSwitchEmitter.emit(MainComponents.LIST_PEOPLE);
    } else {
      this.uiSwitchEmitter.emit(MainComponents.RESERVATION);
    }
  }

}
