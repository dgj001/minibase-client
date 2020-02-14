import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TreeService } from '../services/tree.service';
import { TreeLine } from '../models/tree-line.model';
import { Crumb } from '../models/crumb.model';
import { ProjectService } from 'src/app/core/project.service';

@Component({
  selector: 'app-database-editor',
  templateUrl: './database-editor.component.html',
  styleUrls: ['./database-editor.component.scss']
})
export class DatabaseEditorComponent implements OnInit, OnDestroy {
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
