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
  public labels: LabelWrapper[];
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
    this.dormService.getAllLabel().subscribe(ls => {
      this.labels = [];
      for (const l of ls) {
        const label = Object.assign(new Label(), l);
        this.labels.push(new LabelWrapper(this.hasLabel(label), label));
      }
    });
  }

  hasLabel(label: Label): boolean {
    return (this.temp.labelConnectors.findIndex(lc => lc.label.id === label.id) !== -1);
  }

  toggleLabel(label: LabelWrapper): void {
    label.state = !label.state;
  }

  regexValid(): boolean {
    const nameValid = this.regExpName.test(this.temp.name);
    const neptunValid = this.regExpNeptun.test(this.temp.neptunId);
    const emailValid = this.regExpEmail.test(this.temp.email);

    if (!nameValid) {
      AppComponent.messageEvent.emit('Érvénytelen név!');
    }

    if (!neptunValid) {
      AppComponent.messageEvent.emit('Érvénytelen Neptun kód!');
    }

    if (!emailValid) {
      AppComponent.messageEvent.emit('Érvénytelen e-mail cím!');
    }

    return (nameValid && neptunValid && emailValid);
  }

  save(): void {
    if (this.regexValid()){
      this.dormService.modifyPerson(this.temp).subscribe(status => {
        // TODO: handle status messages
         // console.log(status);
      });
      this.labels.forEach(l => {
        if (l.state !== this.hasLabel(l.label)){
          if (l.state){
            this.dormService.associateLabel(this.person, l.label);
          }
          else {
            this.dormService.disassociateLabel(this.person, l.label);
          }
        }
      });

      AppComponent.messageEvent.emit('Mentés sikeres!');
      this.closeWindow.emit();
    }
  }

  cancel(): void {
    // AppComponent.messageEvent.emit("Változtatások elvetve!");
    // console.log("Változtatások elvetve!");
    this.closeWindow.emit();
  }

  reset(): void {
    this.temp = JSON.parse(JSON.stringify(this.person));
    AppComponent.messageEvent.emit('Adatok alaphelyzetbe állítva!');
  }

}

export class LabelWrapper{
  public state: boolean;
  public label: Label;

  constructor(state: boolean, label: Label) {
    this.state = state;
    this.label = label;
  }
}