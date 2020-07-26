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

  // Role association operations
  public associateRole: Observable<any>

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
      Urls.ROOM_SET_LOCK_STATE, new RoomModificationData(room, room.sex, locked));
  }
  public setRoomAllowed(room: Room, sex: Sex): Observable<RoomRequestStatus> {
    return this.startPostRequest<RoomRequestStatus>(
      Urls.ROOM_SET_LOCK_STATE, new RoomModificationData(room, sex, room.locked));
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
  public id: bigint;
  public name: string;
  public neptunId: string;
  public email: string;
  public newbie: boolean;
  public sex: Sex;
  public labelConnectors: LabelConnector[];
  public roomConnector: RoomConnector;
  public roleConnector: RoleConnector[];

  get isAdmin(): boolean {
    console.log(this.roleConnector.find(rc => rc.role.role === RoleType.ADMIN));
    return this.roleConnector.find(rc => rc.role.role === RoleType.ADMIN) !== null;
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
  LOCK_STATE_INVALID
}
class LabelAssociationData {
  constructor(person: People, label: Label) {
    this.person = person;
    this.label = label;
  }

  public readonly person: People;
  public readonly label: Label;
}
class ReservationData {
  constructor(person: People, room: Room) {
  }

  public readonly person: People;
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
