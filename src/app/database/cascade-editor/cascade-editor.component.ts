import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from 'src/app/core/project.service';
import { CascadeService } from '../services/cascade-service';
import { Subscription, Observable } from 'rxjs';
import { Collection } from '../models/collection.model';

@Component({
  selector: 'app-cascade-editor',
  templateUrl: './cascade-editor.component.html',
  styleUrls: ['./cascade-editor.component.scss']
})
export class CascadeEditorComponent implements OnInit, OnDestroy {
  private projSubs: Subscription;

  collections$: Observable<Collection[]>;

  constructor(
    private projectService: ProjectService,
    private cascadeService: CascadeService
  ) { }

  ngOnInit(): void {
    this.projSubs = this.projectService.selectedProjectId.subscribe(id => {
      this.collections$ = this.cascadeService.collections;
      this.cascadeService.load(id);
    });
  }

  ngOnDestroy() {
    this.projSubs.unsubscribe();
  }
}
