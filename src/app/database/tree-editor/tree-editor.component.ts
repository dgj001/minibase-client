import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TreeLine } from '../models/tree-line.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { TreeService } from '../services/tree.service';
import { Crumb } from '../models/crumb.model';

@Component({
  selector: 'app-tree-editor',
  templateUrl: './tree-editor.component.html',
  styleUrls: ['./tree-editor.component.scss']
})
export class TreeEditorComponent implements OnInit, OnDestroy {

  visibleLines$: Observable<TreeLine[]>;
  crumbs$: Observable<Crumb[]>;

  private projSubs: Subscription;

  constructor(
    private projectService: ProjectService,
    private treeService: TreeService
  ) { }

  ngOnInit() {
    this.visibleLines$ = this.treeService.visibleLines;
    this.crumbs$ = this.treeService.crumbs;
    this.projSubs = this.projectService.selectedProjectId.subscribe(id => {
      this.treeService.load(id);
    });
  }

  ngOnDestroy() {
    this.projSubs.unsubscribe();
  }

  onExpandAll() {
    this.treeService.expandAll();
  }

  onCollapseAll() {
    this.treeService.collapseAll();
  }

  onClickCrumb(id: string) {
    this.treeService.setRoot(id);
  }
}
