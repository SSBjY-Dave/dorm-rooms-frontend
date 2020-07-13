import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }
}
