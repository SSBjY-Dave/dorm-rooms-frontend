import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from './urls';

@Injectable({
  providedIn: 'root'
})
export class DormService {
  constructor(http: HttpClient) {
    this.http = http;
    this.authorizationToken = (new URL(window.location.href)).searchParams.get('token'); // TODO: this is ugly as fuck
  }

  private readonly authorizationToken: string;
  private http: HttpClient;


  // Label association operations
  public disassociate(person: People, label: Label): Observable<LabelAssociationRequestStatus> {
    return this.startPostRequest<LabelAssociationRequestStatus>(
      Urls.LABEL_ASSOCIATION_DISASSOCIATE, new LabelAssociationData(person, label));
  }
  public associate(person: People, label: Label): Observable<LabelAssociationRequestStatus> {
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
  public getAllLabel(): Observable<LabelRequestStatus[]> {
    return this.startGetRequest<LabelRequestStatus[]>(Urls.LABEL_GET_ALL);
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
  public getAllPeople(): Observable<People[]> {
    return this.startGetRequest<People[]>(Urls.PERSON_GET_ALL);
  }
  public getAllPeopleAdmin(): Observable<People[]> {
    return this.startGetRequest<People[]>(Urls.PERSON_GET_ALL_ADMIN);
  }
  public getCurrentPerson(): Observable<People> {
    return this.startGetRequest<People>(Urls.PERSON_GET_CURRENT);
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
    return this.startPostRequest<ReservationRequestStatus>(Urls.RESERVATION_CHANGE_ROOM, room);
  }

  // Room operations
  public setRoomLockState(room: Room, locked: boolean): Observable<RoomRequestStatus> {
    return this.startPostRequest<RoomRequestStatus>(
      Urls.ROOM_SET_LOCK_STATE, new RoomModificationData(room, room.getSex(), locked));
  }
  public setRoomAllowed(room: Room, sex: Sex): Observable<RoomRequestStatus> {
    return this.startPostRequest<RoomRequestStatus>(
      Urls.ROOM_SET_LOCK_STATE, new RoomModificationData(room, sex, room.isLocked()));
  }

  private getRequestHeader(): any {
    return {Authorization: 'Basic ' + this.authorizationToken, 'Content-Type': 'application/json;charset=UTF-8'};
  }
  private startGetRequest<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {headers: this.getRequestHeader()});
  }
  private startPostRequest<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, {headers: this.getRequestHeader()});
  }
}
export enum DormEvents {
  NO_AUTH_INFO
}
export enum Sex {
  MALE, FEMALE, ANY
}
export class People {
  private id: bigint;
  private name: string;
  private neptunId: string;
  private email: string;
  private newbie: boolean;
  private sex: Sex;
  private labelConnectors: LabelConnector[];
  private roomConnector: RoomConnector;
  private roleConnector: RoleConnector[];


  public getId(): bigint { return this.id; }
  public getName(): string { return this.name; }
  public getNeptunId(): string { return this.neptunId; }
  public getEmail(): string { return this.email; }
  public getNewbie(): boolean { return this.newbie; }
  public getSex(): Sex { return this.sex; }
  public getLabelConnectors(): LabelConnector[] { return this.labelConnectors; }
  public getRoomConnector(): RoomConnector { return this.roomConnector; }
  public getRoleConnector(): RoleConnector[] { return this.roleConnector; }

  public setName(value: string): void { this.name = value; }
  public setEmail(value: string): void { this.email = value; }
  public setNewbie(value: boolean): void { this.newbie = value; }
  public setSex(value: Sex): void { this.sex = value; }
}
export class LabelConnector {
  private id: bigint;
  private people: People;
  private label: Label;


  public setId(): bigint { return this.id; }
  public setPeople(): People { return this.people; }
  public setLabel(): Label { return this.label; }
}
export class Label {
  private id: bigint;
  private name: string;
  private labelConnectors: LabelConnector[];


  public getId(): bigint { return this.id; }
  public getName(): string { return this.name; }
  public getLabelConnectors(): LabelConnector[] { return this.labelConnectors; }

  public setName(value: string): void { this.name = value; }
}
export class RoomConnector {
  private id: bigint;
  private people: People;
  private room: Room;


  public getId(): bigint { return this.id; }
  public getPeople(): People { return this.people; }
  public getRoom(): Room { return this.room; }
}
export class Room {
  private id: bigint;
  private level: number;
  private roomNumber: number;
  private locked: boolean;
  private capacity: number;
  private sex: Sex;
  private roomConnectors: RoomConnector[];


  public getId(): bigint { return this.id; }
  public getLevel(): number { return this.level; }
  public getRoomNumber(): number { return this.roomNumber; }
  public isLocked(): boolean { return this.locked; }
  public getCapacity(): number { return this.capacity; }
  public getSex(): Sex { return this.sex; }
  public getRoomConnectors(): RoomConnector[] { return this.roomConnectors; }
  public isFull(): boolean { return this.roomConnectors.length >= this.capacity; }

  public setSex(value: Sex): void { this.sex = value; }
  public setLocked(value: boolean): boolean { if (Number.isInteger(value)) { this.locked = value; } return this.locked; }
  public setCapacity(value: number): number { if (Number.isInteger(value)) { this.capacity = value; } return this.capacity; }
}
export class RoleConnector {
  private id: bigint;
  private people: People;
  private role: Role;


  public getId(): bigint { return this.id; }
  public getPeople(): People { return this.people; }
  public getRole(): Role { return this.role; }
}
export enum RoleType {
  RESIDENT, ADMIN
}
export class Role {
  private id: bigint;
  private role: RoleType;
  private roleConnectors: RoomConnector[];


  public getId(): bigint { return this.id; }
  public getRole(): RoleType { return this.role; }
  public getRoleConnectors(): RoomConnector[] { return this.roleConnectors; }
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
  LOCK_STATE_INVALID
}
class LabelAssociationData {
  constructor(person: People, label: Label) {
    this.person = person;
    this.label = label;
  }

  private readonly person: People;
  private readonly label: Label;


  public getPeople(): People { return this.person; }
  public getLabel(): Label { return this.label; }
}
class ReservationData {
  constructor(person: People, room: Room) {
  }

  private readonly person: People;
  private readonly room: Room;


  public getPeople(): People { return this.person; }
  public getLabel(): Room { return this.room; }
}
class RoomModificationData {
  constructor(room: Room, sex: Sex, locked: boolean) {
    this.room = room;
    this.sex = sex;
    this.locked = locked;
  }

  private readonly room: Room;
  private readonly sex: Sex;
  private readonly locked: boolean;


  public getRoom(): Room { return this.room; }
  public getSex(): Sex { return this.sex; }
  public isLocked(): boolean { return this.locked; }
}
