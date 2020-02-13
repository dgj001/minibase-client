import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeColumn } from '../models/tree-column.model';

@Component({
  selector: 'app-tree-col',
  templateUrl: './tree-col.component.html',
  styleUrls: ['./tree-col.component.scss']
})
export class TreeColComponent implements OnInit {
  @Input() column: TreeColumn;
  @Output() toggle = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onClickOverlay() {
    this.toggle.emit();
  }
}
