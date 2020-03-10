import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Document } from 'src/app/core/models/document.model';
import { BaseLineComponent } from '../base-line/base-line.component';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'app-document-line',
  templateUrl: './document-line.component.html',
  styleUrls: [
    './document-line.component.scss',
    './../base-line/base-line.component.scss' // parent stylesheet
  ]
})
export class DocumentLineComponent extends BaseLineComponent implements OnInit, OnDestroy {
  @ViewChild('newName')
  newName: ElementRef;

  document: Document;

  treeSubs: Subscription;

  constructor(treeService: TreeService, private ref: ChangeDetectorRef) {
    super(treeService);
  }

  ngOnInit() {
    this.document = this.line.object;

    this.treeSubs = this.treeService.lockIdChanged.subscribe(id => {
      this.lockId = id;
      if (this.receivedLock()) {
        if (this.line.isNew) {
          this.ref.detectChanges();
          this.newName.nativeElement.focus();
        }
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.treeSubs.unsubscribe();
  }

  addNew() {
    this.treeService.releaseLock(this.document.id);
    this.treeService.save(this.document.id);
  }

  cancelNew() {
    this.treeService.releaseLock(this.document.id);
    this.treeService.revert(this.document.id);
  }

  private receivedLock(): boolean {
    return this.lockId === this.document.id;
  }

  onClickName() {
    this.treeService.setRoot(this.document.id);
  }
}
