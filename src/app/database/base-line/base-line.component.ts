import { Input, Component, OnDestroy } from '@angular/core';
import { TreeService } from '../services/tree.service';
import { TreeLine } from '../models/tree-line.model';
import { Subscription } from 'rxjs';

@Component({
  template: ''
})
export class BaseLineComponent implements OnDestroy {
  @Input() line: TreeLine;

  public lockId: string;

  addSubs: Subscription;

  constructor(protected treeService: TreeService) { }

  ngOnDestroy() {
    if (this.addSubs) {
      this.addSubs.unsubscribe();
    }
  }

  async onAddChild() {
    try {
      this.addSubs = this.treeService.addChild(this.line.id).subscribe(id => {
        this.treeService.requestLock(id);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async onDeleteChild() {
    try {
      this.treeService.delete(this.line.id);
    } catch (err) {
      console.log(err);
    }
  }

  async onToggleClick() {
    try {
      this.treeService.toggle(this.line.id);
    } catch (err) {
      console.log(err);
    }
  }
}
