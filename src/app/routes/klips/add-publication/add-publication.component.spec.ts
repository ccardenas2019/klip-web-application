import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKlipComponent } from './add-publication.component';

describe('AddKlipComponent', () => {
  let component: AddKlipComponent;
  let fixture: ComponentFixture<AddKlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
