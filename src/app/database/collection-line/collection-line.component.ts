import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Collection } from '../models/collection.model';
import { BaseLineComponent } from '../base-line/base-line.component';
import { TreeService } from '../services/tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-line',
  templateUrl: './collection-line.component.html',
  styleUrls: [
    './collection-line.component.scss',
    './../base-line/base-line.component.scss' // parent stylesheet
  ]
})
export class CollectionLineComponent extends BaseLineComponent implements OnInit, OnDestroy {
  @ViewChild('newName')
  newName: ElementRef;

  collection: Collection;

  treeSubs: Subscription;

  constructor(treeService: TreeService, private ref: ChangeDetectorRef) {
    super(treeService);
  }

  ngOnInit() {
    this.collection = this.line.object;

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
    this.treeService.releaseLock(this.collection.id);
    this.treeService.save(this.collection.id);
  }

  cancelNew() {
    this.treeService.releaseLock(this.collection.id);
    this.treeService.revert(this.collection.id);
  }

  receivedLock(): boolean {
    return this.lockId === this.collection.id;
  }

  onClickName() {
    this.treeService.setRoot(this.collection.id);
  }
}
