import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLineComponent } from './document-line.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';
import { LetterButtonComponent } from '../letter-button/letter-button.component';
import { TreeColumnsComponent } from '../tree-columns/tree-columns.component';

describe('DocumentLineComponent', () => {
  let component: DocumentLineComponent;
  let fixture: ComponentFixture<DocumentLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentLineComponent,
        LetterButtonComponent,
        TreeColumnsComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLineComponent);
    component = fixture.componentInstance;
    component.line = {
      isLastSibling: [],
      isParent: false,
      isExpanded: false,
      isNew: false,
      id: 'col1',
      object: { id: 'doc1', collectionId: 'col1', name: 'colname' },
      type: 'collection'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
