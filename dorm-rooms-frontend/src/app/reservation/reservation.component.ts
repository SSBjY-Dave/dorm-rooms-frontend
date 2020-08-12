import {AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DormService, People, Room, Sex} from '../dorm.service';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit, AfterViewInit {
  private changeDetectorReference: ChangeDetectorRef;
  private dormService: DormService;
  private domStuffInitialized: boolean;
  @ViewChildren('buildingTemplate') buildingTemplate: QueryList<any>;

  private http: HttpClient;
  public currentPerson: People;
  public building: Level[];
  public currentFloor = 0;

  public reservationOverlayRoom: RoomWrapper;

  constructor(changeDetectorReference: ChangeDetectorRef, dormService: DormService, http: HttpClient) {
    this.changeDetectorReference = changeDetectorReference;
    this.dormService = dormService;
    this.http = http;
  }

  ngOnInit(): void {
    this.loadData(this);
    this.dormService.reloadDaemonEvent.subscribe(_ => this.loadData(this));
  }

  ngAfterViewInit(): void {
    this.buildingTemplate.changes.subscribe(_ => this.domRenderFinished(this));
  }

  public isHandheldDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
  }

  public tryApplyForRoom(roomWrapper: RoomWrapper): void {
    if (this.dormService.canApplyForRoom(roomWrapper.room, this.currentPerson)) {
      this.showPageOverlay(roomWrapper);
    }
  }

  public applyForRoom(roomWrapper: RoomWrapper): void {
    this.hidePageOverlay();
    roomWrapper.operationPending = true;
    if (!this.currentPerson.hasRoom) {
      this.dormService.applyForRoom(roomWrapper.room).subscribe(res => {
        console.log(res);
        roomWrapper.operationPending = true;
      });
    } else if (!this.isPersonInRoom(roomWrapper)) {
      this.dormService.changeRoom(roomWrapper.room).subscribe(res => {
        console.log(res);
        roomWrapper.operationPending = true;
      });
    }
  }

  public isPersonInRoom(roomWrapper: RoomWrapper): boolean {
    return  this.currentPerson.roomConnector !== undefined && this.currentPerson.roomConnector !== null &&
            this.currentPerson.roomConnector.room.id === roomWrapper.room.id;
  }

  public fullRoomNumber(level: number, roomNumber: number): string {
    return level + ((roomNumber < 10) ? '0' : '') + roomNumber;
  }

  public domRenderFinished(self: ReservationComponent): void {
    if (!self.domStuffInitialized) {
      self.setDefaults();
      self.attachEventListeners();
      self.attachAnimationClass();
    } else {
      self.attachAnimationClass();
    }
    self.domStuffInitialized = true;
  }

  public showPageOverlay(roomWrapper: RoomWrapper): void {
    this.reservationOverlayRoom = roomWrapper;
    this.changeDetectorReference.detectChanges();
    const pageOverlay = document.getElementsByClassName('page_overlay')[0];
    setTimeout((overlay) => overlay.classList.remove('page_overlay_hidden'), 1, pageOverlay);
  }

  public hidePageOverlay(): void {
    const pageOverlay = document.getElementsByClassName('page_overlay')[0];
    pageOverlay.classList.add('page_overlay_hidden');
    setTimeout((self: ReservationComponent) => {
      self.reservationOverlayRoom = null;
      self.changeDetectorReference.detectChanges();
    }, 250, this);
  }

  public setRoomSex(room: RoomWrapper, sexStr: string): void {
    const sex = Sex[sexStr];
    room.operationPending = true;
    this.dormService.setRoomAllowedSex(room.room, sex).subscribe(() => room.operationPending = true);
  }

  public clearRoom(room: RoomWrapper): void {
    room.operationPending = true;
    this.dormService.clearRoom(room.room).subscribe(() => room.operationPending = true);
  }

  public setRoomLockedState(room: RoomWrapper, lockState: boolean): void {
    room.operationPending = true;
    this.dormService.setRoomLockState(room.room, lockState);
  }

  private setDefaults(): void {
    const floors = document.getElementsByClassName('floor');
    if (floors.length === 0 || this.domStuffInitialized) { return; }
    floors[0].classList.add('active');
    floors[1].classList.add('offset-top');
  }

  private attachEventListeners(): void {
    const floors = document.getElementsByClassName('floor');
    if (floors.length === 0 || this.domStuffInitialized) { return; }
    this.domStuffInitialized = true;
    document.addEventListener('wheel', event => {
      this.showFloor(this.currentFloor + ((event.deltaY > 0) ? 1 : -1));
    });
  }

  private attachAnimationClass(): void {
    const floors = document.getElementsByClassName('floor');
    // tslint:disable-next-line:prefer-for-of // because there is no iterator for HTMLElementCollection :( (fuck you javascript)
    for (let i = 0; i < floors.length; ++i) {
      floors[i].classList.add('reservation-transition');
    }
  }

  private loadData(self: ReservationComponent): void {
    self.dormService.getCurrentPerson().subscribe(p => this.currentPerson = Object.assign(new People(), p))
    self.loadRooms(self);
  }

  private loadRooms(self: ReservationComponent): void {
    self.http.get<any[]>('assets/building/adk/layout.json').subscribe(layout => {
      self.dormService.getAllRooms().subscribe(rooms => self.createBuilding(self, layout, rooms));
    });
  }
  private createBuilding(self: ReservationComponent, layout: any[], rooms: Room[]): void {
    const sortedRooms = rooms.sort((a, b) => (a.level === b.level) ? a.roomNumber - b.roomNumber : b.level - a.level);
    const levels = [];
    let roomIndex = 0;
    for (let i = 0; i < layout.length; ++i) {
      levels.push(new Level(layout.length - 1 - i));
      levels[i].roomWrappers = [];
      for (let j = 0; j < layout[i].rooms.length; ++j, ++roomIndex) {
        levels[i].roomWrappers.push(
          new RoomWrapper(
            layout[i].rooms[j].number,
            new Point2D(
              layout[i].rooms[j].offset.x,
              layout[i].rooms[j].offset.y,
            ),
            new Size(
              layout[i].rooms[j].size.width,
              layout[i].rooms[j].size.height,
            ),
            Object.assign(new Room(), rooms[roomIndex])
          )
        );
      }
    }
    self.building = levels;
  }

  public calculateSelectorItemLineHeight(): string {
    const buildingLevelSelectorHeight = getComputedStyle(document.getElementById('building_level_selector')).height;
    return this.convertPxToRem(this.removeUnit(buildingLevelSelectorHeight) / this.building.length);
  }

  public convertPxToRem(value: number): string {
    return value / this.removeUnit(getComputedStyle(document.getElementsByTagName('html')[0]).fontSize) + 'rem';
  }
  public calculateRoomX(baseOffset: number): number {
    return (this.removeUnit(getComputedStyle(document.getElementById('building')).width) * baseOffset) / 880;
  }

  public calculateRoomY(baseOffset: number): number {
    return (this.removeUnit(getComputedStyle(document.getElementById('building')).height) * baseOffset) / 1128;
  }

  public removeUnit(value: string): number {
    return parseFloat(value);
  }

  public showFloor(floorIndex: number): void {
    // if ($("#page_overlay").hasClass("active")) return;
    const floors = document.getElementsByClassName('floor');
    if (floorIndex < 0 || floors.length <= floorIndex) { return; }
    // warning suspended because HTMLTagCollection doesn't have an iterator
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < floors.length; ++i) {
      floors[i].classList.remove('active');
      floors[i].classList.remove('offset-top');
      floors[i].classList.remove('offset-bottom');
    }

    if (floorIndex !== 0) {
      floors[floorIndex - 1].classList.add('offset-bottom');
    }
    floors[floorIndex].classList.add('active');

    if (floorIndex !== floors.length - 1) {
      floors[floorIndex + 1].classList.add('offset-top');
    }

    let floorContainerTopOffset;
    if (floorIndex === 0) { floorContainerTopOffset = 30; }
    else { floorContainerTopOffset = -30 / floors.length * floorIndex; }

    document.getElementById('building').style.top = floorContainerTopOffset + '%';

    const levelSelectorHeight = this.removeUnit(getComputedStyle(document.getElementById('building_level_selector')).height);
    const levelSelectorTopOffset = this.convertPxToRem(levelSelectorHeight / floors.length * floorIndex);
    // ts-ignore is needed because angular's compiler is retarded and thinks the style property doesn't exists
    // @ts-ignore
    document.getElementsByClassName('selector_overlay')[0].style.top = levelSelectorTopOffset;
    this.currentFloor = floorIndex;
  }

  public roomNumberToFuckingHungarianRagozottForma(roomNumber: string): string {
    let prefix = '';
    let suffix = '';
    switch (roomNumber[0]) {
      case '1': case '5':
        prefix += 'az'; break;
      default:
        prefix += 'a'; break;
    }
    switch (roomNumber.substr(1, 2)) {
      case '00':
        suffix += 'ás'; break;
      case '03': case '08':
        suffix += 'as'; break;
      case '05': case '15':
        suffix += 'ös'; break;
      default:
        suffix += 'es'; break;
    }
    return prefix + ' ' + roomNumber + '-' + suffix;
  }
}
class Level {
  public level: number;
  public roomWrappers: RoomWrapper[];

  constructor(level: number) {
    this.level = level;
  }
}
class RoomWrapper {
  public roomNumber: number;
  public offset: Point2D;
  public size: Size;
  public room: Room;
  public operationPending = false;

  constructor(roomNumber: number, offset: Point2D, size: Size, room: Room) {
    this.roomNumber = roomNumber;
    this.offset = offset;
    this.size = size;
    this.room = room;
  }

  get paddedRoomNumber(): string {
    return ((this.roomNumber < 10) ? '0' : '') + this.roomNumber.toString();
  }

  get residents(): People[] {
    const residents = [];
    for (const rc of this.room.roomConnectors) {
      residents.push(rc.people);
    }
    return residents;
  }
}
class Point2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = Number(x);
    this.y = Number(y);
  }
}
class Size {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = Number(width);
    this.height = Number(height);
  }
}
