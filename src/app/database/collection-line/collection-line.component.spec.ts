import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionLineComponent } from './collection-line.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';
import { LetterButtonComponent } from '../letter-button/letter-button.component';
import { TreeColumnsComponent } from '../tree-columns/tree-columns.component';

describe('CollectionLineComponent', () => {
  let component: CollectionLineComponent;
  let fixture: ComponentFixture<CollectionLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CollectionLineComponent,
        LetterButtonComponent,
        TreeColumnsComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionLineComponent);
    component = fixture.componentInstance;
    component.line = {
      isLastSibling: [],
      isParent: false,
      isExpanded: false,
      isNew: false,
      id: 'col1',
      object: { id: 'col1', databaseId: 'db1', name: 'colname' },
      type: 'collection'
    };
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
