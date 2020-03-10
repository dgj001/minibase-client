import { Injectable } from '@angular/core';
import { DbDataService } from './db-data.service';
import { Database } from '../models/database.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Collection } from '../models/collection.model';
import { Document } from '../models/document.model';
import { Field } from '../models/field.model';

@Injectable()
export class CascadeService {
  private projectId: string;
  private database: Database;

  isLoadingCollections = new Subject<boolean>();
  selectedCollection = new BehaviorSubject<string>(undefined);
  collections = new BehaviorSubject<Collection[]>([]);

  isLoadingDocuments = new Subject<boolean>();
  selectedDocument = new BehaviorSubject<string>(undefined);
  documents = new BehaviorSubject<Document[]>([]);

  isLoadingFields = new Subject<boolean>();
  fields = new BehaviorSubject<Field[]>([]);

  constructor(private dbDataService: DbDataService) { }

  loadCollections(projectId: string) {
    if (projectId === this.projectId) {
      return; // already loaded
    }

    this.isLoadingCollections.next(true);

    // Load database node to get database id
    this.dbDataService.getDatabase(projectId).subscribe(db => {
      this.database = db;

      // Use database id to get collections
      this.dbDataService.getCollections(this.database.id)
        .subscribe(collections => {
          this.collections.next(collections);
          if (collections.length > 0) {
            const colId = collections[0].id;
            this.selectedCollection.next(colId);
            this.selectCollection(colId);
          }
          this.isLoadingCollections.next(false);
        });
    });
    this.projectId = projectId;
  }

  selectCollection(collectionId: string) {
    this.isLoadingDocuments.next(true);

    // Use collection id to get documents
    this.dbDataService.getDocuments(collectionId)
      .subscribe(documents => {
        this.selectedCollection.next(collectionId);
        this.documents.next(documents);
        if (documents.length > 0) {
          const docId = documents[0].id;
          this.selectedDocument.next(docId);
          this.selectDocument(docId);
        }
        this.isLoadingDocuments.next(false);
      });
  }

  selectDocument(documentId: string) {
    this.isLoadingFields.next(true);

    // Use collection id to get documents
    this.dbDataService.getFields(documentId)
      .subscribe(fields => {
        this.selectedDocument.next(documentId);
        this.fields.next(fields);
        this.isLoadingFields.next(false);
      });
  }
}
