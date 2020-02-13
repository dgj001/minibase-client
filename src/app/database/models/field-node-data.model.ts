import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NodeData } from './node-data.model';
import { DbDataService } from '../services/db-data.service';
import { Field } from './field.model';

export class FieldNodeData extends NodeData {
  private field: Field;
  private _isNew = true;
  private nameCopy: string;
  private valueCopy: string;

  constructor(fld: Field, dbDataService: DbDataService) {
    super(dbDataService);
    this.field = fld;
    this.nameCopy = fld.name;
    this.valueCopy = fld.value;
  }

  static get(id: string, dbDataService: DbDataService): Observable<NodeData> {
    return dbDataService.getField(id)
      .pipe(
        map((fld: Field) => {
          const nodeData = new FieldNodeData(fld, dbDataService);
          nodeData._isNew = false;
          return nodeData;
        })
      );
  }

  static getSiblings(parentId: string, dbDataService: DbDataService): Observable<NodeData[]> {
    return dbDataService.getFields(parentId)
      .pipe(
        map(flds => {
          return flds.map(fld => {
            const nodeData = new FieldNodeData(fld, dbDataService);
            nodeData._isNew = false;
            return nodeData;
          });
        })
      );
  }

  createChild(): NodeData {
    throw new Error('Not supported');
  }

  delete(): Observable<boolean> {
    if (this._isNew) {
      return of(false);
    } else {
      return this.dbDataService.deleteField(this.field.id);
    }
  }

  fetchChildren(): Observable<NodeData[]> {
    throw new Error('Not supported');
  }

  getObject(): any {
    return this.field;
  }

  getType(): string {
    return 'field';
  }

  isNew(): boolean {
    return this._isNew;
  }

  needToFecthChildren() {
    return false;
  }

  revert(): void {
    this.field.name = this.nameCopy;
    this.field.value = this.valueCopy;
  }

  save(): Observable<boolean> {
    if (this._isNew) {
      return this.dbDataService.createField(this.field)
        .pipe(
          tap(() => {
            this._isNew = false;
            this.nameCopy = this.field.name;
            this.valueCopy = this.field.value;
          })
        );

    } else {
      return this.dbDataService.updateField(this.field)
        .pipe(
          tap(() => {
            this.nameCopy = this.field.name;
            this.valueCopy = this.field.value;
          })
        );
    }
  }
}
