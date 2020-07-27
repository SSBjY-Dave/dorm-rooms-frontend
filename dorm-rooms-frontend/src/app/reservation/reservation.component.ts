import { Component, OnInit } from '@angular/core';
import {DormService, Room} from '../dorm.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  private dormService: DormService;
  private http: HttpClient;
  public building: Level[];

  constructor(dormService: DormService, http: HttpClient) {
    this.dormService = dormService;
    this.http = http;
  }

  ngOnInit(): void {
    this.loadRooms();
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
              layout[i].rooms[j].size.x,
              layout[i].rooms[j].size.y,
            ),
            rooms[roomIndex]
          )
        );
      }
    }
    this.building = levels;
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
}
class Point2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
class Size {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
