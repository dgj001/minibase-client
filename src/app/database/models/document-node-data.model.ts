import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';

import { DbDataService } from 'src/app/core/services/db-data.service';
import { Document } from 'src/app/core/models/document.model';

import { NodeData } from './node-data.model';
import { FieldNodeData } from './field-node-data.model';

export class DocumentNodeData extends NodeData {
  private document: Document;
  private needsChildren = false;
  private _isNew = true;
  private nameCopy: string;

  constructor(doc: Document, dbDataService: DbDataService) {
    super(dbDataService);
    this.document = doc;
    this.nameCopy = doc.name;
    this.needsChildren = false;
  }

  static get(id: string, restService: DbDataService): Observable<NodeData> {
    return restService.getDocument(id)
      .pipe(
        flatMap((doc: Document) => {
          return restService.getFieldCount(doc.id)
            .pipe(
              map((count: number) => {
                const nodeData = new DocumentNodeData(doc, restService);
                nodeData._isNew = false;
                nodeData.needsChildren = count > 0;
                return nodeData;
              })
            );
        })
      );
  }

  static getSiblings(parentId: string, restService: DbDataService): Observable<NodeData[]> {
    return restService.getDocuments(parentId)
      .pipe(
        flatMap(docs => {
          return forkJoin(
            docs.map(doc => {
              return restService.getFieldCount(doc.id)
                .pipe(
                  map(count => {
                    const nodeData = new DocumentNodeData(doc, restService);
                    nodeData._isNew = false;
                    nodeData.needsChildren = count > 0;
                    return nodeData;
                  })
                );
            })
          );
        })
      );
  }

  createChild(): NodeData {
    if (this.needToFecthChildren()) {
      return undefined;
    } else {
      const doc = { id: 'newid', documentId: this.document.id, name: 'new field' };
      return new FieldNodeData(doc, this.dbDataService);
    }
  }

  delete(): Observable<boolean> {
    if (this._isNew) {
      return of(false);
    } else {
      return this.dbDataService.deleteDocument(this.document.id);
    }
  }

  fetchChildren(): Observable<NodeData[]> {
    return FieldNodeData.getSiblings(this.document.id, this.dbDataService)
      .pipe(
        tap(() => {
          this.needsChildren = false;
        })
      );
  }

  getObject(): any {
    return this.document;
  }

  getType(): string {
    return 'document';
  }

  isNew(): boolean {
    return this._isNew;
  }

  needToFecthChildren() {
    return this.needsChildren;
  }

  revert(): void {
    this.document.name = this.nameCopy;
  }

  save(): Observable<boolean> {
    if (this._isNew) {
      return this.dbDataService.createDocument(this.document)
        .pipe(
          tap(() => {
            this._isNew = false;
            this.nameCopy = this.document.name;
          })
        );

    } else {
      return this.dbDataService.updateDocument(this.document)
        .pipe(
          tap(() => {
            this.nameCopy = this.document.name;
          })
        );
    }
  }
}
