import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterButtonComponent } from './letter-button.component';

describe('LetterButtonComponent', () => {
  let component: LetterButtonComponent;
  let fixture: ComponentFixture<LetterButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
