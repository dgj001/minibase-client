import { Observable } from 'rxjs';
import { DbDataService } from '../services/db-data.service';

export abstract class NodeData {
  constructor(protected dbDataService: DbDataService) { }

  static get(id: string, dbDataService: DbDataService): Observable<NodeData> {
    return undefined; // subclass should override
  }
  static getSiblings(parentId: string, dbDataService: DbDataService): Observable<NodeData[]> {
    return undefined; // subclass should override
  }

  abstract createChild(): NodeData;
  abstract delete(): Observable<boolean>;
  abstract fetchChildren(): Observable<NodeData[]>;
  abstract getObject(): any;
  abstract getType(): string;
  abstract isNew(): boolean;
  abstract needToFecthChildren(): boolean;
  abstract revert(): void;
  abstract save(): Observable<boolean>;
}
