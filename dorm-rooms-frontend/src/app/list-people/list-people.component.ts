import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { DormService, People, PeopleRequestStatus, RoleType } from '../dorm.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.css']
})
export class ListPeopleComponent implements OnInit {

  private dormService: DormService;
  public people: People[];
  public person: People;
  public peopleFilterText: string = "";
  public peopleFilterType: string = "name";
  public editActive: boolean = false;
  
  constructor(dormService: DormService) { 
    this.dormService = dormService;
  }
  
  personSelector(person: People): void {
    this.person = person;
  } 

  closePanel(): void {
    this.editActive = false;
  }

  openPanel(person: People): void {
    this.editActive = true;
    this.person=person;
  }

  ngOnInit(): void {
    this.dormService.getAllPeopleAdmin().subscribe(p => {
      this.people = p; 
      console.log("data arrived")
    });
  }

  public isAdmin(person: People): boolean {
    console.log(person.roleConnector);
    return person.roleConnector.find(rc => rc.role.role === RoleType.ADMIN) !== null;
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

  deletePerson(person: People): void{
    if (confirm("Biztos, hogy törölni akarja " + person.name + " az adatbázisból?")){
      this.dormService.deletePerson(person).subscribe(status => {
        // if (status[0] === PeopleRequestStatus.OK){
        //   alert("Felhasználó törölve!");
        // }
        // else {
        //   alert("Törlés sikertelen!");
        //   console.log(status);
        // }
        // const personIndex = this.people.findIndex(p => p === person);
        // if (personIndex === this.people.length-1){
        //   this.people.pop();
        // }
        // else{
        //   this.people.slice(personIndex, personIndex+1);
        // }
      });
    }
  }

  setPersonAdmin(person: People): void{

  }

  exportTable(): void{
    console.log("soon");
  }  

}
