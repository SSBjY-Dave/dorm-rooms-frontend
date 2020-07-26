import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-window',
  templateUrl: './edit-window.component.html',
  styleUrls: ['./edit-window.component.css']
})
export class EditWindowComponent implements OnInit {

  constructor() { }

  //public person People;

  ngOnInit(): void {

  }

  openPanel(): void {
    document.getElementById("panel").style.display="block";
  }

  save(): void {
    console.log("Változtatások elmentve!");
    document.getElementById("panel").style.display="none";
  }

  cancel(): void {
    console.log("Változtatások elvetve!");
    document.getElementById("panel").style.display="none";
  }

  reset(): void {
    console.log("Adatok alaphelyzetbe állítva");
  }

}
