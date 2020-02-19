import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarContentComponent } from './toolbar-content.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectService } from '../core/project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ToolbarContentComponent', () => {
  let component: ToolbarContentComponent;
  let fixture: ComponentFixture<ToolbarContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarContentComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [ProjectService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
