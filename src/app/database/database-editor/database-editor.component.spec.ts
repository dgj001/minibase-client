import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseEditorComponent } from './database-editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';
import { ProjectService } from 'src/app/core/project.service';
import { RoundIconButtonComponent } from 'src/app/shared/round-icon-button/round-icon-button.component';

describe('DatabaseEditorComponent', () => {
  let component: DatabaseEditorComponent;
  let fixture: ComponentFixture<DatabaseEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatabaseEditorComponent,
        RoundIconButtonComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [
        ProjectService,
        TreeService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
