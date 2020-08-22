import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelWindowComponent } from './label-window.component';

describe('LabelWindowComponent', () => {
  let component: LabelWindowComponent;
  let fixture: ComponentFixture<LabelWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
