import { Component, OnInit } from '@angular/core';
import { DormService, People } from '../dorm.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {
  private dormService: DormService;
  public person: People;

  constructor(dormService: DormService) {
    this.dormService = dormService;
  }

  ngOnInit(): void {
    this.dormService.getCurrentPerson().subscribe(p => this.person = p);
  }

}
