import { Injectable } from '@angular/core';
import { DatabaseNodeData } from '../models/database-node-data.model';
import { DbDataService } from './db-data.service';
import { Database } from '../models/database.model';
import { CollectionNodeData } from '../models/collection-node-data.model';
import { DocumentNodeData } from '../models/document-node-data.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Collection } from '../models/collection.model';
import { Document } from '../models/document.model';
import { map } from 'rxjs/operators';
import { Field } from '../models/field.model';
import { FieldNodeData } from '../models/field-node-data.model';

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
    DatabaseNodeData.get(projectId, this.dbDataService).subscribe(nodeData => {
      this.database = nodeData.getObject();
      // Use database id to get collections
      CollectionNodeData.getSiblings(this.database.id, this.dbDataService)
        .pipe(
          map(nodes => {
            return nodes.map(node => node.getObject());
          })
        )
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
    DocumentNodeData.getSiblings(collectionId, this.dbDataService)
      .pipe(
        map(nodes => {
          return nodes.map(node => node.getObject());
        })
      )
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
    FieldNodeData.getSiblings(documentId, this.dbDataService)
      .pipe(
        map(nodes => {
          return nodes.map(node => node.getObject());
        })
      )
      .subscribe(fields => {
        this.selectedDocument.next(documentId);
        this.fields.next(fields);
        this.isLoadingFields.next(false);
      });

  }
}
