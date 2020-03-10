import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Field } from 'src/app/core/models/field.model';
import { BaseLineComponent } from '../base-line/base-line.component';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-field-line',
  templateUrl: './field-line.component.html',
  styleUrls: [
    './field-line.component.scss',
    './../base-line/base-line.component.scss' // parent stylesheet
  ]
})
export class FieldLineComponent extends BaseLineComponent implements OnInit, OnDestroy {
  @ViewChild('oldValue')
  oldValue: ElementRef;
  @ViewChild('newName')
  newName: ElementRef;

  field: Field;

  treeSubs: Subscription;

  constructor(treeService: TreeService, private ref: ChangeDetectorRef) {
    super(treeService);
  }

  ngOnInit() {
    this.field = this.line.object;

    this.treeSubs = this.treeService.lockIdChanged.subscribe(id => {
      this.lockId = id;
      if (this.receivedLock()) {
        if (this.line.isNew) {
          this.ref.detectChanges();
          this.newName.nativeElement.focus();
        } else {
          this.oldValue.nativeElement.focus();
        }
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.treeSubs.unsubscribe();
  }

  receivedLock(): boolean {
    return this.lockId === this.field.id;
  }

  addNew() {
    this.treeService.releaseLock(this.field.id);
    this.treeService.save(this.field.id);
  }

  cancelNew() {
    this.treeService.releaseLock(this.field.id);
    this.treeService.revert(this.field.id);
  }

  editValue() {
    this.treeService.requestLock(this.field.id);
  }

  saveValue() {
    this.treeService.save(this.field.id);
    if (this.receivedLock()) {
      this.treeService.releaseLock(this.field.id);
    }
  }

  revertValue() {
    this.treeService.revert(this.line.id);
    this.treeService.releaseLock(this.field.id);
    this.oldValue.nativeElement.blur();
  }
}
