import { Component, OnInit } from '@angular/core';
import {DormService, People, Room} from '../dorm.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  private dormService: DormService;
  private domStuffInitialized: boolean;

  private http: HttpClient;
  public currentPerson: People;
  public building: Level[];
  public currentFloor = 0;

  constructor(dormService: DormService, http: HttpClient) {
    this.dormService = dormService;
    this.http = http;
  }

  ngOnInit(): void {
    this.dormService.getCurrentPerson().subscribe(p => this.currentPerson = p);
    this.loadRooms();
  }

  public fullRoomNumber(level: number, roomNumber: number): string {
    return level + ((roomNumber < 10) ? '0' : '') + roomNumber;
  }

  public domRenderFinished(): void {
    this.setDefaults();
    this.attachEventListeners();
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

  private loadRooms(): void {
    this.http.get<any[]>('assets/building/adk/layout.json').subscribe(layout => {
      this.dormService.getAllRooms().subscribe(rooms => this.createBuilding(layout, rooms));
    });
  }
  private createBuilding(layout: any[], rooms: Room[]): void {
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
            rooms[roomIndex]
          )
        );
      }
    }
    this.building = levels;
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
