import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseLineComponent } from './database-line.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';
import { LetterButtonComponent } from '../letter-button/letter-button.component';
import { TreeColumnsComponent } from '../tree-columns/tree-columns.component';

describe('DatabaseLineComponent', () => {
  let component: DatabaseLineComponent;
  let fixture: ComponentFixture<DatabaseLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatabaseLineComponent,
        LetterButtonComponent,
        TreeColumnsComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseLineComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    component.line = {
      isLastSibling: [],
      isParent: false,
      isExpanded: false,
      isNew: false,
      id: 'col1',
      object: { id: 'db1', projectId: 'proj1', name: 'dbname' },
      type: 'collection'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
