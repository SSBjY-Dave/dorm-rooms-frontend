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
  public peopleFilterText: string = "";
  public peopleFilterType: string = "name";
  ngOnInit(): void {
    this.dormService.getAllPeopleAdmin().subscribe(p => {
      this.people = p; 
      console.log("data arrived")
    });
  }

  isPersonMachesFilter(person: People): boolean {
    if (this.peopleFilterText === "" || typeof(this.peopleFilterText) === "undefined"){
      return true;
    }
    
    let searchText = "";

    switch (this.peopleFilterType) {
      case "name":
        searchText = person.name.toUpperCase();
        break;
      case "neptun":
        searchText = person.neptunId.toUpperCase();
        break;
      case "email":
        searchText = person.email.toUpperCase();
        break;
      default:
        break;
    }
    
    return searchText.indexOf(this.peopleFilterText.toUpperCase()) != -1;
  }

  editPerson(person: People): void{
    
    console.log(person);
  }

  exportTable(): void{
    console.log("soon");
  }  

}
