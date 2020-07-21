import { Component, OnInit } from '@angular/core';
import { DormService, People } from '../dorm.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.css']
})
export class ListPeopleComponent implements OnInit {

  constructor(dormService: DormService) { 
    this.dormService = dormService;
  }

  private dormService: DormService;
  public people: People[];
  ngOnInit(): void {
      this.dormService.getAllPeopleAdmin.subscribe(p => this.people = p);
  }

}
