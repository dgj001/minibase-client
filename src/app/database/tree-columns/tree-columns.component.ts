import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TreeService } from '../services/tree.service';
import { TreeLine } from '../models/tree-line.model';
import { TreeColumn } from '../models/tree-column.model';

@Component({
  selector: 'app-tree-columns',
  templateUrl: './tree-columns.component.html',
  styleUrls: ['./tree-columns.component.scss']
})
export class TreeColumnsComponent implements OnInit {
  @Input() line: TreeLine;

  columns: TreeColumn[];

  constructor(
    private treeService: TreeService
  ) {
  }

  ngOnInit() {
    this.columns = [];
    const isRoot = this.line.isLastSibling.length === 1;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.line.isLastSibling.length; i++) {
      const isLast = this.line.isLastSibling[i];
      if (i < this.line.isLastSibling.length - 1) {
        this.columns.push({
          topVert: !isLast,
          bottomVert: !isLast,
          rightHoriz: false,
          isParent: false,
          isExpanded: false
        });
      } else {
        this.columns.push({
          topVert: !isRoot,
          bottomVert: !isLast,
          rightHoriz: true,
          isParent: this.line.isParent,
          isExpanded: this.line.isExpanded
        });
      }
    }
  }

  onColToggle() {
    this.treeService.toggle(this.line.id);
  }
}
