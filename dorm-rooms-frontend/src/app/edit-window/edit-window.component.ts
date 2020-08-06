import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DormService, People, Label } from '../dorm.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-edit-window',
  templateUrl: './edit-window.component.html',
  styleUrls: ['./edit-window.component.css']
})
export class EditWindowComponent implements OnInit {

  private dormService: DormService;
  private appComponent: AppComponent;
  @Input() person: People;
  @Output() closeWindow = new EventEmitter();
  public labels: Label[];
  public label: Label;
  public temp: People;
  public regExpName = /^\p{Lu}[\p{Ll}]+( \p{Lu}[\p{Ll}]+)+$/u;
  public regExpNeptun = /^[A-Z0-9]{6}$/;
  public regExpEmail = /^([A-z0-9\.\-\_]+)@([a-z0-9\.\-\_]+)\.([a-z]{2,})$/;

  constructor(dormService: DormService) { 
    this.dormService = dormService;
  }
  
  ngOnInit(): void {
    this.temp = JSON.parse(JSON.stringify(this.person));
    this.dormService.getAllLabel().subscribe(l => {
      this.labels = []; 
      for (const label of l) {
        this.labels.push(Object.assign(new Label(), label));
      }
      console.log("data arrived")
    });
  }

  toggleLabel(label: Label){
    
  }

  regexValid(): boolean {
    let nameValid = this.regExpName.test(this.temp.name);
    let neptunValid = this.regExpNeptun.test(this.temp.neptunId);
    let emailValid = this.regExpEmail.test(this.temp.email);
    
    if (!nameValid) {
      AppComponent.messageEvent.emit("Érvénytelen név!");
    }
    
    if (!neptunValid) {
      AppComponent.messageEvent.emit("Érvénytelen Neptun kód!");
    }

    if (!emailValid) {
      AppComponent.messageEvent.emit("Érvénytelen e-mail cím!");
    }

    return (nameValid && neptunValid && emailValid);
  }

  save(): void {
    if (this.regexValid()){
      this.dormService.modifyPerson(this.temp).subscribe(status => {
        //TODO: handle status messages
         //console.log(status);
      });
      AppComponent.messageEvent.emit("Mentés sikeres!");
      this.closeWindow.emit();
    }
  }

  cancel(): void {
    //AppComponent.messageEvent.emit("Változtatások elvetve!");
    //console.log("Változtatások elvetve!");
    this.closeWindow.emit();
  }

  reset(): void {
    console.log(this.temp);
    this.temp = JSON.parse(JSON.stringify(this.person));
    AppComponent.messageEvent.emit("Adatok alaphelyzetbe állítva!");
  }

}
