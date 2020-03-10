import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';

import { DbDataService } from 'src/app/core/services/db-data.service';
import { Collection } from 'src/app/core/models/collection.model';

import { NodeData } from './node-data.model';
import { DocumentNodeData } from './document-node-data.model';

export class CollectionNodeData extends NodeData {
  private collection: Collection;
  private needsChildren = false;
  private _isNew = true;
  private nameCopy: string;

  constructor(col: Collection, dbDataService: DbDataService) {
    super(dbDataService);
    this.collection = col;
    this.nameCopy = col.name;
    this.needsChildren = false;
  }

  static get(id: string, dbDataService: DbDataService): Observable<NodeData> {
    return dbDataService.getCollection(id)
      .pipe(
        flatMap((col: Collection) => {
          return dbDataService.getDocumentCount(col.id)
            .pipe(
              map((count: number) => {
                const nodeData = new CollectionNodeData(col, dbDataService);
                nodeData._isNew = false;
                nodeData.needsChildren = count > 0;
                return nodeData;
              })
            );
        })
      );
  }

  static getSiblings(parentId: string, dbDataService: DbDataService): Observable<NodeData[]> {
    return dbDataService.getCollections(parentId)
      .pipe(
        flatMap(cols => {
          return forkJoin(
            cols.map(col => {
              return dbDataService.getDocumentCount(col.id)
                .pipe(
                  map(count => {
                    const nodeData = new CollectionNodeData(col, dbDataService);
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
      const doc = { id: 'newid', collectionId: this.collection.id, name: 'new document' };
      return new DocumentNodeData(doc, this.dbDataService);
    }
  }

  delete(): Observable<boolean> {
    if (this._isNew) {
      return of(false);
    } else {
      return this.dbDataService.deleteCollection(this.collection.id);
    }
  }

  fetchChildren(): Observable<NodeData[]> {
    return DocumentNodeData.getSiblings(this.collection.id, this.dbDataService)
      .pipe(
        tap(() => {
          this.needsChildren = false;
        })
      );
  }

  getObject(): any {
    return this.collection;
  }

  getType(): string {
    return 'collection';
  }

  isNew(): boolean {
    return this._isNew;
  }

  needToFecthChildren() {
    return this.needsChildren;
  }

  revert(): void {
    this.collection.name = this.nameCopy;
  }

  save(): Observable<boolean> {
    if (this._isNew) {
      return this.dbDataService.createCollection(this.collection)
        .pipe(
          tap(() => {
            this._isNew = false;
            this.nameCopy = this.collection.name;
          })
        );

    } else {
      return this.dbDataService.updateCollection(this.collection)
        .pipe(
          tap(() => {
            this.nameCopy = this.collection.name;
          })
        );
    }
  }
}
