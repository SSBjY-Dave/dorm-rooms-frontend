import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from './urls';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DormService {
  constructor(http: HttpClient) {
    this.http = http;
    this.authorizationToken = (new URL(window.location.href)).searchParams.get('token'); // TODO: this is ugly as fuck
    this.rescheduleReloadDaemon(this);
  }

  private readonly authorizationToken: string;
  private http: HttpClient;
  private cachedDormData: CachedDormData = new CachedDormData();
  private reloadDaemonTimerID: number;

  public readonly reloadDaemonEvent = new EventEmitter<boolean>();


  // Label association operations
  public disassociateLabel(person: People, label: Label): Observable<LabelAssociationRequestStatus> {
    return this.startPostRequest<LabelAssociationRequestStatus>(
      Urls.LABEL_ASSOCIATION_DISASSOCIATE, new LabelAssociationData(person, label));
  }
  public associateLabel(person: People, label: Label): Observable<LabelAssociationRequestStatus> {
    return this.startPostRequest<LabelAssociationRequestStatus>(
      Urls.LABEL_ASSOCIATION_ASSOCIATE, new LabelAssociationData(person, label));
  }

  // Label operations
  public addLabel(label: Label): Observable<LabelRequestStatus[]> {
    return this.startPostRequest<LabelRequestStatus[]>(Urls.LABEL_ADD, label);
  }
  public deleteLabel(label: Label): Observable<LabelRequestStatus[]> {
    return this.startPostRequest<LabelRequestStatus[]>(Urls.LABEL_DELETE, label);
  }
  public modifyLabel(label: Label): Observable<LabelRequestStatus[]> {
    return this.startPostRequest<LabelRequestStatus[]>(Urls.LABEL_MODIFY, label);
  }
  private getAllLabelNow(): Observable<Label[]> {
    const result = this.startGetRequest<Label[]>(Urls.LABEL_GET_ALL);
    result.subscribe(labels => this.cachedDormData.labelsAll = labels);
    return result;
  }
  public getAllLabel(): Observable<Label[]> {
    if (this.cachedDormData.labelsAll === undefined) {
      return this.getAllLabelNow();
    }
    return this.createObservableFromCachedData<Label[]>(this.cachedDormData.labelsAll);
  }

  // People operations
  public addPerson(person: People): Observable<PeopleRequestStatus[]> {
    return this.startPostRequest<PeopleRequestStatus[]>(Urls.PERSON_ADD, person);
  }
  public deletePerson(person: People): Observable<PeopleRequestStatus[]> {
    return this.startPostRequest<PeopleRequestStatus[]>(Urls.PERSON_DELETE, person);
  }
  public modifyPerson(person: People): Observable<PeopleRequestStatus[]> {
    return this.startPostRequest<PeopleRequestStatus[]>(Urls.PERSON_MODIFY, person);
  }
  private getAllPeopleNow(): Observable<People[]> {
    const result = this.startGetRequest<People[]>(Urls.PERSON_GET_ALL);
    result.subscribe(ps => this.cachedDormData.peopleAll = ps);
    return result;
  }
  public getAllPeople(): Observable<People[]> {
    if (this.cachedDormData.peopleAll === undefined) {
      return this.getAllPeopleNow();
    }
    return this.createObservableFromCachedData<People[]>(this.cachedDormData.peopleAll);
  }
  private getAllPeopleAdminNow(): Observable<People[]> {
    const result = this.startGetRequest<People[]>(Urls.PERSON_GET_ALL_ADMIN);
    result.subscribe(ps => this.cachedDormData.peopleAllAdmin = ps);
    return result;
  }
  public getAllPeopleAdmin(): Observable<People[]> {
    if (this.cachedDormData.peopleAll === undefined) {
      return this.getAllPeopleAdminNow();
    }
    return this.createObservableFromCachedData<People[]>(this.cachedDormData.peopleAllAdmin);
  }
  private getCurrentPersonNow(): Observable<People> {
    const result = this.startGetRequest<People>(Urls.PERSON_GET_CURRENT);
    result.subscribe(p => this.cachedDormData.currentPerson = p);
    return result;
  }
  public getCurrentPerson(): Observable<People> {
    if (this.cachedDormData.peopleAll === undefined) {
      return this.getCurrentPersonNow();
    }
    return this.createObservableFromCachedData<People>(this.cachedDormData.currentPerson);
  }

  // Role association operations
  public associateRole(person: People, roleType: RoleType): Observable<RoleAssociationRequestStatus> {
    return this.startPostRequest<RoleAssociationRequestStatus>(
      Urls.ROLE_ASSOCIATION_ASSOCIATE, new RoleAssociationData(person, roleType));
  }
  public disassociateRole(person: People, roleType: RoleType): Observable<RoleAssociationRequestStatus> {
    return this.startPostRequest<RoleAssociationRequestStatus>(
      Urls.ROLE_ASSOCIATION_DISASSOCIATE, new RoleAssociationData(person, roleType));
  }

  // Reservation operations
  public applyForRoom(room: Room): Observable<ReservationRequestStatus> {
    return this.startPostRequest<ReservationRequestStatus>(Urls.RESERVATION_APPLY_FOR_ROOM, room);
  }
  public leaveRoom(): Observable<ReservationRequestStatus> {
    return this.startPostRequest<ReservationRequestStatus>(Urls.RESERVATION_LEAVE_ROOM, null);
  }
  public changeRoom(newRoom: Room): Observable<ReservationRequestStatus> {
    return this.startPostRequest<ReservationRequestStatus>(Urls.RESERVATION_CHANGE_ROOM, newRoom);
  }
  public assignToRoom(person: People, room: Room): Observable<ReservationRequestStatus> {
    return this.startPostRequest<ReservationRequestStatus>(
      Urls.RESERVATION_ASSIGN_TO_ROOM, new ReservationData(person, room));
  }
  public clearRoom(room: Room): Observable<ReservationRequestStatus> {
    return this.startPostRequest<ReservationRequestStatus>(Urls.RESERVATION_CLEAR_ROOM, room);
  }

  // Room operations
  public setRoomLockState(room: Room, locked: boolean): Observable<RoomRequestStatus> {
    return this.startPostRequest<RoomRequestStatus>(
      Urls.ROOM_SET_LOCK_STATE, new RoomModificationData(room, room.sex, locked));
  }
  public setRoomAllowedSex(room: Room, sex: Sex): Observable<RoomRequestStatus> {
    return this.startPostRequest<RoomRequestStatus>(
      Urls.ROOM_SET_ALLOWED_SEX, new RoomModificationData(room, sex, room.locked));
  }
  private getAllRoomsNow(): Observable<Room[]> {
    const result = this.startGetRequest<Room[]>(Urls.ROOM_GET_ALL);
    result.subscribe(rs => this.cachedDormData.roomsAll = rs);
    return result;
  }
  public getAllRooms(): Observable<Room[]> {
    if (this.cachedDormData.peopleAll === undefined) {
      return this.getAllRoomsNow();
    }
    return this.createObservableFromCachedData<Room[]>(this.cachedDormData.roomsAll);
  }
  public canApplyForRoom(room: Room, currentPerson: People): boolean {
    // ERROR: This condition will always return 'false' since the types 'string' and 'RoleType' have no overlap.
    // This is not true so fuck you angular
    // @ts-ignore
    return  (room.sex === Sex[Sex.ANY] || room.sex === currentPerson.sex) &&
            (currentPerson.roomConnector === null) || (room.id !== currentPerson.roomConnector.room.id) &&
            (room.roomConnectors.length < room.capacity) &&
            (!room.locked);
  }

  private getRequestHeader(): any {
    return {Authorization: 'Basic ' + this.authorizationToken, 'Content-Type': 'application/json;charset=UTF-8'};
  }
  private startGetRequest<T>(url: string): Observable<T> {
    const result = this.http.get<T>(url, {headers: this.getRequestHeader()}).pipe(share());
    result.subscribe(_ => {}, error => console.error(error));
    return result;
  }
  private startPostRequest<T>(url: string, body: any): Observable<T> {
    const result = this.http.post<T>(url, body, {headers: this.getRequestHeader()}).pipe(share());
    result.subscribe(_ => {}, error => console.error(error), () => this.rescheduleReloadDaemon(this, 1));
    return result;
  }

  private createObservableFromCachedData<T>(data: T): Observable<T> {
    return new Observable<T>(observer => {
      observer.next(data);
      observer.complete();
    });
  }

  private rescheduleReloadDaemon(self: DormService, timeoutType: number = 0): void {
    clearTimeout(self.reloadDaemonTimerID);
    const timeoutTime = timeoutType === 0 ? 5000 : 2000;
    self.reloadDaemonTimerID = setTimeout(self.reloadDaemon, timeoutTime, self);
  }

  private async reloadDaemon(self: DormService = null): Promise<void> {
    if (self.cachedDormData.labelsAll !== undefined) {
      await self.getAllLabelNow().toPromise();
    }
    if (self.cachedDormData.currentPerson !== undefined) {
      await self.getCurrentPersonNow().toPromise();
    }
    if (self.cachedDormData.peopleAll !== undefined) {
      await self.getAllPeopleNow().toPromise();
    }
    if (self.cachedDormData.peopleAllAdmin !== undefined) {
      await self.getAllPeopleAdminNow().toPromise();
    }
    if (self.cachedDormData.roomsAll !== undefined) {
      await self.getAllRoomsNow();
    }

    self.rescheduleReloadDaemon(self);
    self.reloadDaemonEvent.emit(true); // TODO: emit false if error
  }
}
class CachedDormData {
  public labelsAll: Label[];

  public currentPerson: People;
  public peopleAll: People[];
  public peopleAllAdmin: People[];

  public roomsAll: Room[];
}
export enum DormEvents {
  NO_AUTH_INFO
}
export enum Sex {
  MALE, FEMALE, ANY
}
export class People {
  public id: bigint;
  public name: string;
  public neptunId: string;
  public email: string;
  public newbie: boolean;
  public sex: Sex;
  public labelConnectors: LabelConnector[];
  public roomConnector: RoomConnector;
  public roleConnectors: RoleConnector[];

  get isAdmin(): boolean {
    // ERROR: This condition will always return 'false' since the types 'string' and 'RoleType' have no overlap.
    // This is not true so fuck you angular
    // @ts-ignore
    return this.roleConnectors.find(rc => RoleType[rc.role.role] === RoleType.ADMIN) !== undefined;
  }

  get hasRoom(): boolean {
    return this.roomConnector !== undefined && this.roomConnector !== null;
  }
}
export class LabelConnector {
  public id: bigint;
  public people: People;
  public label: Label;
}
export class Label {
  public id: bigint;
  public name: string;
  public labelConnectors: LabelConnector[];
}
export class RoomConnector {
  public id: bigint;
  public people: People;
  public room: Room;
}
export class Room {
  public id: bigint;
  public level: number;
  public roomNumber: number;
  public locked: boolean;
  public capacity: number;
  public sex: Sex;
  public roomConnectors: RoomConnector[];
}
export class RoleConnector {
  public id: bigint;
  public people: People;
  public role: Role;
}
export enum RoleType {
  RESIDENT, ADMIN
}
export class Role {
  public id: bigint;
  public role: RoleType;
  public roleConnectors: RoomConnector[];
}
export enum RoleAssociationRequestStatus {
  OK,
  ROLE_INVALID, ROLE_ALREADY_ASSOCIATED, ROLE_NOT_ASSOCIATED,
  PEOPLE_INVALID
}
export enum PeopleRequestStatus {
  OK,
  ID_INVALID, ID_ALREADY_EXISTS,
  NAME_INVALID,
  NEPTUN_ID_INVALID, NEPTUN_ID_ALREADY_EXISTS,
  EMAIL_INVALID, EMAIL_ALREADY_EXITS,
  TOKEN_INVALID, TOKEN_ALREADY_EXISTS,
  SEX_INVALID
}
export enum LabelAssociationRequestStatus {
  OK,
  PEOPLE_ID_INVALID, LABEL_ID_INVALID,
  LABEL_ALREADY_ASSIGNED, LABEL_IS_NOT_ASSIGNED
}
export enum LabelRequestStatus {
  OK,
  ID_INVALID, ID_ALREADY_EXISTS, ID_DOES_NOT_EXISTS,
  NAME_INVALID, NAME_ALREADY_EXISTS, NAME_DOES_NOT_EXISTS,
}
export enum ReservationRequestStatus {
  OK,
  ROOM_ID_INVALID, PEOPLE_ID_INVALID,
  ROOM_ALREADY_FULL, ROOM_IS_EMPTY,
  RESERVATION_NOT_FOUND, RESERVATION_ALREADY_EXISTS,
  SEX_INVALID,
  DATA_RACE_LOST,
  ROOM_IS_LOCKED
}
export enum RoomRequestStatus {
  OK,
  ID_INVALID,
  LEVEL_INVALID, LEVEL_DOES_NOT_EXISTS,
  ROOM_NUMBER_INVALID, ROOM_NUMBER_DOES_NOT_EXISTS,
  LOCK_STATE_INVALID,
  SEX_INVALID
}
class RoleAssociationData {
  constructor(person: People, roleType: RoleType) {
    this.people = person;
    this.roleType = roleType;
  }

  public readonly people: People;
  public readonly roleType: RoleType;
}
class LabelAssociationData {
  constructor(person: People, label: Label) {
    this.people = person;
    this.label = label;
  }

  public readonly people: People;
  public readonly label: Label;
}
class ReservationData {
  constructor(person: People, room: Room) {
    this.people = person;
    this.room = room;
  }

  public readonly people: People;
  public readonly room: Room;
}
class RoomModificationData {
  constructor(room: Room, sex: Sex, locked: boolean) {
    this.room = room;
    this.sex = sex;
    this.locked = locked;
  }

  public readonly room: Room;
  public readonly sex: Sex;
  public readonly locked: boolean;
}
