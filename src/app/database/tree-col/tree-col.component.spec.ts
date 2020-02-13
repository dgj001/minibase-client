import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeColComponent } from './tree-col.component';

describe('TreeColComponent', () => {
  let component: TreeColComponent;
  let fixture: ComponentFixture<TreeColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeColComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeColComponent);
    component = fixture.componentInstance;
    component.column = {
      topVert: false,
      bottomVert: false,
      rightHoriz: false,
      isParent: false,
      isExpanded: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
