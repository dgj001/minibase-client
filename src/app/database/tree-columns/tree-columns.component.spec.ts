import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeColumnsComponent } from './tree-columns.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';

describe('TreeColumnsComponent', () => {
  let component: TreeColumnsComponent;
  let fixture: ComponentFixture<TreeColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeColumnsComponent],
      imports: [HttpClientTestingModule],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeColumnsComponent);
    component = fixture.componentInstance;
    component.line = {
      isLastSibling: [],
      isParent: false,
      isExpanded: false,
      isNew: false,
      id: 'fld1',
      object: { id: 'fld1', documentId: 'doc1', name: 'fldname', value: 'fldvalue' },
      type: 'field'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
