import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { ProjectService } from 'src/app/core/services/project.service';
import { Collection } from 'src/app/core/models/collection.model';
import { Document } from 'src/app/core/models/document.model';
import { Field } from 'src/app/core/models/field.model';

import { CascadeService } from '../services/cascade-service';

@Component({
  selector: 'app-cascade-editor',
  templateUrl: './cascade-editor.component.html',
  styleUrls: ['./cascade-editor.component.scss']
})
export class CascadeEditorComponent implements OnInit, OnDestroy {
  private projSubs: Subscription;

  // Collection observables
  isLoadingCols$: Observable<boolean>;
  selectedCol$: Observable<string>;
  collections$: Observable<Collection[]>;

  // Document observables
  isLoadingDocs$: Observable<boolean>;
  selectedDoc$: Observable<string>;
  documents$: Observable<Document[]>;

  // Field observables
  isLoadingFlds$: Observable<boolean>;
  fields$: Observable<Field[]>;

  constructor(
    private projectService: ProjectService,
    private cascadeService: CascadeService
  ) { }

  ngOnInit(): void {
    this.projSubs = this.projectService.selectedProjectId.subscribe(id => {
      // Collection observables
      this.isLoadingCols$ = this.cascadeService.isLoadingCollections;
      this.selectedCol$ = this.cascadeService.selectedCollection;
      this.collections$ = this.cascadeService.collections;

      this.isLoadingDocs$ = this.cascadeService.isLoadingDocuments;
      this.selectedDoc$ = this.cascadeService.selectedDocument;
      this.documents$ = this.cascadeService.documents;

      this.isLoadingFlds$ = this.cascadeService.isLoadingFields;
      this.fields$ = this.cascadeService.fields;

      this.cascadeService.loadCollections(id);
    });
  }

  ngOnDestroy() {
    this.projSubs.unsubscribe();
  }

  selectCollection(id: string) {
    this.cascadeService.selectCollection(id);
  }

  selectDocument(id: string) {
    this.cascadeService.selectDocument(id);
  }
}
