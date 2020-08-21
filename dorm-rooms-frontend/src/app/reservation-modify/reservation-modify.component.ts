import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DormService, People, Room} from '../dorm.service';

@Component({
  selector: 'app-reservation-modify',
  templateUrl: './reservation-modify.component.html',
  styleUrls: ['./reservation-modify.component.css']
})
export class ReservationModifyComponent implements OnInit {
  @Input() person: People;
  @Output() closeWindow = new EventEmitter();
  private dormService: DormService;
  public rooms: Room[];
  public building: Level[];
  public shownFloor = 0;

  constructor(dormService: DormService) {
    this.dormService = dormService;
  }

  ngOnInit(): void {
    this.loadData(this);
    this.dormService.reloadDaemonEvent.subscribe(_ => this.loadData(this));
  }

  public closeOverlay(): void {
    this.closeWindow.emit(null);
  }

  public assignToRoom(room: Room): void {
    this.dormService.assignToRoom(this.person, room).subscribe(console.log);
  }

  public showFloor(floorIndex: number): void {
    const floors = document.getElementById('reservation-modify').getElementsByTagName('section');
    // tslint:disable-next-line:prefer-for-of // because there is no iterator for HTMLElementCollection :( (fuck you javascript)
    for (let i = 0; i < floors.length; ++i) {
      floors[i].classList.remove('active');
    }
    floors[floorIndex].classList.add('active');
    this.shownFloor = floorIndex;
  }

  private loadData(self: ReservationModifyComponent): void {
    self.dormService.getAllRooms().subscribe(r => {
      const rooms: Room[] = [];
      r.forEach(room => rooms.push(Object.assign(new Room(), room)));
      const sortedRooms: Room[] = rooms.sort((a, b) => (a.level === b.level) ? a.roomNumber - b.roomNumber : b.level - a.level);
      const levels = [];
      for (const room of sortedRooms) {
        if (levels.length === 0 || levels[levels.length - 1].level !== room.level) {
          levels.push(new Level(room.level));
        }
        levels[levels.length - 1].rooms.push(room);
      }
      self.building = levels;
    });
  }
}

class Level {
  public level: number;
  public rooms: Room[];

  constructor(level: number) {
    this.level = level;
    this.rooms = [];
  }
}
