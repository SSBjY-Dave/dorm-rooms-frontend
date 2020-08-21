import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { DormService, People, PeopleRequestStatus, RoleType } from '../dorm.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.component.html',
  styleUrls: ['./list-people.component.css']
})
export class ListPeopleComponent implements OnInit {

  private dormService: DormService;
  public people: People[];
  public person: People;
  public peopleFilterText = '';
  public peopleFilterType = 'name';
  public peopleEditorActive = false;
  public labelEditorActive: boolean = false;

  constructor(dormService: DormService) {
    this.dormService = dormService;
  }

  personSelector(person: People): void {
    this.person = person;
  } 
  
  openPeopleEditor(person: People): void {
    this.peopleEditorActive = true;
    this.person=person;
  }
  
  closePeopleEditor(): void {
    this.peopleEditorActive = false;
  }

  openLabelEditor(): void {
    this.labelEditorActive = true;
  }

  closeLabelEditor(): void {
    this.labelEditorActive = false;
  }

  ngOnInit(): void {
    this.loadData(this);
    this.dormService.reloadDaemonEvent.subscribe(_ => this.loadData(this));
  }

  loadData(self: ListPeopleComponent): void {
    self.dormService.getAllPeopleAdmin().subscribe(p => {
      self.people = [];
      for (const person of p) {
        self.people.push(Object.assign(new People(), person));
      }
    });
  }

  isPersonMatchesFilter(person: People): boolean {
    if (this.peopleFilterText === '' || typeof(this.peopleFilterText) === 'undefined'){
      return true;
    }

    let searchText = '';
    switch (this.peopleFilterType) {
      case 'name':
        searchText = person.name.toUpperCase();
        break;
      case 'neptun':
        searchText = person.neptunId.toUpperCase();
        break;
      case 'email':
        searchText = person.email.toUpperCase();
        break;
      default:
        break;
    }

    return searchText.indexOf(this.peopleFilterText.toUpperCase()) !== -1;
  }

  deletePerson(person: People): void{
    if (confirm('Biztos, hogy törölni akarja ' + person.name + ' az adatbázisból?')){
      this.dormService.deletePerson(person).subscribe(status => {
        // if (status[0] === PeopleRequestStatus.OK){
        //   alert("Felhasználó törölve!");
        //   AppComponent.messageEvent.emit("Személy törölve!");
        // }
        // else {
        //   alert("Törlés sikertelen!");
        //   AppComponent.messageEvent.emit("Törlés sikertelen!");
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
    if (person.isAdmin){
      this.dormService.disassociateRole(person, RoleType.ADMIN).subscribe(fazs => console.log(fazs));
    }
    else {
      this.dormService.associateRole(person, RoleType.ADMIN).subscribe(fazs => console.log(fazs));
    }
  }

  openReservation(): void{
    
  }

  exportTable(): void{
    console.log('soon');
  }

}
