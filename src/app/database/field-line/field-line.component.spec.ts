import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldLineComponent } from './field-line.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../services/tree.service';
import { LetterButtonComponent } from '../letter-button/letter-button.component';
import { TreeColumnsComponent } from '../tree-columns/tree-columns.component';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { FormsModule } from '@angular/forms';

describe('FieldLineComponent', () => {
  let component: FieldLineComponent;
  let fixture: ComponentFixture<FieldLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FieldLineComponent,
        LetterButtonComponent,
        TreeColumnsComponent
      ],
      imports: [
        AutoSizeInputModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [TreeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldLineComponent);
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
