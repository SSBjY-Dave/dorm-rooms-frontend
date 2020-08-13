import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationModifyComponent } from './reservation-modify.component';

describe('ReservationModifyComponent', () => {
  let component: ReservationModifyComponent;
  let fixture: ComponentFixture<ReservationModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
