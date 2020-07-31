import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DormService, People } from '../dorm.service';

@Component({
  selector: 'app-edit-window',
  templateUrl: './edit-window.component.html',
  styleUrls: ['./edit-window.component.css']
})
export class EditWindowComponent implements OnInit {

  private dormService: DormService;
  @Input() person: People;
  @Output() closeWindow = new EventEmitter();
  public temp: People;

  constructor(dormService: DormService) { 
    this.dormService = dormService;
  }
  
  ngOnInit(): void {
    this.temp = JSON.parse(JSON.stringify(this.person));
  }

  save(): void {
    this.dormService.modifyPerson(this.temp).subscribe(status => {
      //TODO: handle status messages
      console.log(status);
    });
    this.closeWindow.emit();
  }

  cancel(): void {
    console.log("Változtatások elvetve!");
    this.closeWindow.emit();
  }

  reset(): void {
    console.log(this.temp);
    this.temp = JSON.parse(JSON.stringify(this.person));
    console.log("Adatok alaphelyzetbe állítva");
  }

}
