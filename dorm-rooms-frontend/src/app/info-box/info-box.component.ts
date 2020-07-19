import { Component, OnInit } from '@angular/core';
import {DormService} from '../dorm.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {
  public sneekIncreased = true;
  public name = 'Orcsik Dávid';
  public neptunId = 'US4GMR';
  public room = '202';

  private dormService: DormService;

  constructor(dormService: DormService) {
    this.dormService = dormService;
  }

  ngOnInit(): void {
    this.dormService.getCurrentUser.subscribe(a => console.log(a));
  }
}
