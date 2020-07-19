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
    this.authorizationToken = (new URL(window.location.href)).searchParams.get('token');
  }
  get getCurrentUser(): Observable<People> {
    return this.startGetRequest<People>(Urls.PERSON_GET_CURRENT);
  }
  get getAllPeople(): Observable<People[]> {
    return this.startGetRequest<People[]>(Urls.PERSON_GET_ALL);
  }

  private readonly authorizationToken: string;
  private http: HttpClient;
  private getRequestHeader(): any {
    return {Authorization: 'Basic ' + this.authorizationToken, 'Content-Type': 'application/json;charset=UTF-8'};
  }
  private startGetRequest<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {headers: this.getRequestHeader()});
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


  get getId(): bigint { return this.id; }
  get getName(): string { return this.name; }
  get getNeptunId(): string { return this.neptunId; }
  get getEmail(): string { return this.email; }
  get getNewbie(): boolean { return this.newbie; }
  get getSex(): Sex { return this.sex; }
  get getLabelConnectors(): LabelConnector[] { return this.labelConnectors; }
  get getRoomConnector(): RoomConnector { return this.roomConnector; }
  get getRoleConnector(): RoleConnector[] { return this.roleConnector; }

  set setName(value: string) { this.name = value; }
  set setEmail(value: string) { this.email = value; }
  set setNewbie(value: boolean) { this.newbie = value; }
  set setSex(value: Sex) { this.sex = value; }
}
export class LabelConnector {
  private id: bigint;
  private people: People;
  private label: Label;


  get setId(): bigint { return this.id; }
  get setPeople(): People { return this.people; }
  get setLabel(): Label { return this.label; }
}
export class Label {
  private id: bigint;
  private name: string;
  private labelConnectors: LabelConnector[];


  get getId(): bigint { return this.id; }
  get getName(): string { return this.name; }
  get getLabelConnectors(): LabelConnector[] { return this.labelConnectors; }

  set setName(value: string) { this.name = value; }
}
export class RoomConnector {
  private id: bigint;
  private people: People;
  private room: Room;


  get getId(): bigint { return this.id; }
  get getPeople(): People { return this.people; }
  get getRoom(): Room { return this.room; }
}
export class Room {
  private id: bigint;
  private level: number;
  private roomNumber: number;
  private locked: boolean;
  private capacity: number;
  private sex: Sex;
  private roomConnectors: RoomConnector[];


  get getId(): bigint { return this.id; }
  get getLevel(): number { return this.level; }
  get getRoomNumber(): number { return this.roomNumber; }
  get getLocked(): boolean { return this.locked; }
  get getCapacity(): number { return this.capacity; }
  get getSex(): Sex { return this.sex; }
  get getRoomConnectors(): RoomConnector[] { return this.roomConnectors; }
  get isFull(): boolean { return this.roomConnectors.length >= this.capacity; }

  set setSex(value: Sex) { this.sex = value; }
  set setLocked(value: boolean) { if (Number.isInteger(value)) { this.locked = value; } }
  set setCapacity(value: number) { if (Number.isInteger(value)) { this.capacity = value; } }
}
export class RoleConnector {
  private id: bigint;
  private people: People;
  private role: Role;


  get getId(): bigint { return this.id; }
  get getPeople(): People { return this.people; }
  get getRole(): Role { return this.role; }
}
export enum RoleType {
  RESIDENT, ADMIN
}
export class Role {
  private id: bigint;
  private role: RoleType;
  private roleConnectors: RoomConnector[];


  get getId(): bigint { return this.id; }
  get getRole(): RoleType { return this.role; }
  get getRoleConnectors(): RoomConnector[] { return this.roleConnectors; }
}
