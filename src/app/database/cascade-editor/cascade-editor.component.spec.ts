import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadeEditorComponent } from './cascade-editor.component';

describe('CascadeEditorComponent', () => {
  let component: CascadeEditorComponent;
  let fixture: ComponentFixture<CascadeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CascadeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CascadeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
