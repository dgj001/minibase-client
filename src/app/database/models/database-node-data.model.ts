import { NodeData } from './node-data.model';
import { Observable } from 'rxjs';
import { DbDataService } from '../services/db-data.service';
import { Database } from './database.model';
import { flatMap, map, tap } from 'rxjs/operators';
import { CollectionNodeData } from './collection-node-data.model';

export class DatabaseNodeData extends NodeData {
  private database: Database;
  private needsChildren = false;
  private nameCopy: string;

  private constructor(db: Database, dbDataService: DbDataService) {
    super(dbDataService);
    this.database = db;
    this.nameCopy = db.name;
    this.needsChildren = false;
  }

  static get(id: string, dbDataService: DbDataService): Observable<NodeData> {
    return dbDataService.getDatabase(id)
      .pipe(
        flatMap((db: Database) => {
          return dbDataService.getCollectionCount(db.id)
            .pipe(
              map((count: number) => {
                const node = new DatabaseNodeData(db, dbDataService);
                node.needsChildren = count > 0;
                return node;
              })
            );
        })
      );
  }

  static getSiblings(parentId: string, dbDataService: DbDataService): Observable<NodeData[]> {
    throw new Error('not supported');
  }

  createChild(): NodeData {
    if (this.needToFecthChildren()) {
      return undefined;
    } else {
      const col = { id: 'newid', databaseId: this.database.id, name: 'new collection' };
      return new CollectionNodeData(col, this.dbDataService);
    }
  }

  delete(): Observable<boolean> {
    throw new Error('not supported');
  }

  fetchChildren(): Observable<NodeData[]> {
    return CollectionNodeData.getSiblings(this.database.id, this.dbDataService)
      .pipe(
        tap(() => {
          this.needsChildren = false;
        })
      );
  }

  getObject(): any {
    return this.database;
  }

  getType(): string {
    return 'database';
  }

  isNew(): boolean {
    return false;
  }

  needToFecthChildren() {
    return this.needsChildren;
  }

  revert(): void {
    this.database.name = this.nameCopy;
  }

  save(): Observable<boolean> {
    return this.dbDataService.updateDatabase(this.database)
      .pipe(
        tap(() => {
          this.nameCopy = this.database.name;
        })
      );
  }
}
