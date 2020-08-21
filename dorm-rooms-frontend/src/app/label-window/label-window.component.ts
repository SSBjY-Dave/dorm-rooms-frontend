import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DormService, Label } from '../dorm.service';

@Component({
  selector: 'app-label-window',
  templateUrl: './label-window.component.html',
  styleUrls: ['./label-window.component.css']
})
export class LabelWindowComponent implements OnInit {

  private dormService: DormService;
  @Output() closeWindow = new EventEmitter();
  public labels: LabelWrapper[];
  public label: Label;

  constructor(dormService: DormService) {
    this.dormService = dormService;
  }

  ngOnInit(): void {
    this.dormService.getAllLabel().subscribe(ls => {
      this.labels = [];
      for (const l of ls) {
        const label = Object.assign(new Label(), l);
        this.labels.push(new LabelWrapper(false, label));
      }
    });
  }

  addLabel(label: Label): void {
    let labelName = prompt("Adjon meg nevet az új label-nek!");
    if (labelName !== null) {
      let newLabel = new Label();
      newLabel.name = labelName;
      this.dormService.addLabel(newLabel).subscribe(l => {});
    }
    //send the name to the dormService.addLabel() method
  }

  editLabel(label: LabelWrapper): void {
    label.state=true;
  }

  saveLabel(label: LabelWrapper): void {
      //this.dormService.modifyLabel(label.label).subscribe(l => {});
      label.state=false;
    //send the new name to the dormService.modifyLabel() method
  }

  cancel(label: LabelWrapper): void {
    label.state=false;
  }

  deleteLabel(label: LabelWrapper): void {
    if (confirm("Biztos, hogy törölni akarja " + label.label.name + " az adatbázisból?")){
      this.dormService.deleteLabel(label.label).subscribe(l => {
        //TODO: status handling
      });
      this.labels.splice(this.labels.indexOf(label), 1);
    }
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