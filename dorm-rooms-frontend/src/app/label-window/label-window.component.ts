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
  public labels: Label[];
  public label: Label;

  constructor(dormService: DormService) {
    this.dormService = dormService;
    this.dormService.getAllLabel().subscribe(l => {
      this.labels = [];
      for (const label of l) {
        this.labels.push(Object.assign(new Label(), label));
      }
    });
  }

  addLabel(label: Label): void {
    let labelName = prompt("Adjon meg nevet az új label-nek!");
    let newLabel = new Label();
    newLabel.name = labelName;
    this.dormService.addLabel(newLabel).subscribe(l => {});
    //send the name to the dormService.addLabel() method
  }

  editLabel(label: Label): void {
    const labelName = prompt("Adjon meg új nevet a label-nek!");
    let temp = JSON.parse(JSON.stringify(label));
    temp.name = labelName;
    this.dormService.modifyLabel(temp).subscribe(l => {});
    //send the new name to the dormService.modifyLabel() method
  }

  deleteLabel(label: Label): void {
    if (confirm("Biztos, hogy törölni akarja " + label.name + " az adatbázisból?")){
      this.dormService.deleteLabel(label).subscribe(l => {
        //TODO: status handling
      });
    }
  }

  ngOnInit(): void {
  }

}
