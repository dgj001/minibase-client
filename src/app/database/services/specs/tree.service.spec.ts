import { TestBed } from '@angular/core/testing';

import { TreeService } from '../tree.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DbDataService } from '../../services/db-data.service';

describe('TreeService', () => {
  let service: TreeService;
  let dbDataService: DbDataService;

  const db = {
    id: 'dbid',
    name: 'dbname'
  };

  const col = {
    id: 'col1',
    databaseId: 'dbid',
    name: 'colname'
  };

  const doc = {
    id: 'doc1',
    collectionId: 'col1',
    name: 'docname'
  };

  const fld = {
    id: 'fld1',
    documentId: 'doc1',
    name: 'fldname',
    value: 'fldvalue'
  };

  let callbackCount: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        DbDataService,
        TreeService
      ]
    });
    service = TestBed.inject(TreeService);
    dbDataService = TestBed.inject(DbDataService);
    callbackCount = 0;

    // Set up spies to simulate the following heirarchy:
    // db
    //   col
    //     doc
    //       field

    spyOn(dbDataService, 'getDatabase').and.returnValue(of(db));
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(1));
    spyOn(dbDataService, 'getCollections').and.returnValue(of([col]));
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(1));
    spyOn(dbDataService, 'getDocuments').and.returnValue(of([doc]));
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(1));
    spyOn(dbDataService, 'getFields').and.returnValue(of([fld]));

    spyOn(dbDataService, 'deleteCollection').and.returnValue(of(true));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load project lines', (done) => {
    service.visibleLines.subscribe(lines => {
      callbackCount++;
      //  0th callback will be initial value of BehaviorSubject
      if (callbackCount === 2) {
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(1);
        expect(lines[0].object).toBe(db);
        expect(lines[0].type).toBe('database');
        done();
      }
    });
    service.load('dummy');
  });

  it('should expand all and collapse all nodes', (done) => {
    service.visibleLines.subscribe(lines => {
      callbackCount++;
      if (callbackCount === 2) {
        // db
        expect(lines).toBeTruthy();
        service.expandAll();
      } else if (callbackCount === 3) {
        // db => col => doc => fld
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(4);
        service.collapseAll();
      } else if (callbackCount === 4) {
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(1);
        expect(lines[0].isExpanded).toBe(false);
        done();
      }
    });
    service.load('dummy');
  });

  it('should delete a node', (done) => {
    service.visibleLines.subscribe(lines => {
      callbackCount++;
      if (callbackCount === 2) {
        // db
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(1);
        service.toggle(lines[0].id);
      } else if (callbackCount === 3) {
        // db => col
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(2);
        service.delete(lines[1].id);
      } else if (callbackCount === 4) {
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(1);
        done();
      }
    });
    service.load('dummy');
  });

  it('should add unsaved children, and save them', (done) => {
    const createCol = spyOn(dbDataService, 'createCollection').and.returnValue(of(true));
    service.visibleLines.subscribe(lines => {
      callbackCount++;
      if (callbackCount === 2) {
        // db
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(1);
        service.addChild(lines[0].id).subscribe();
      } else if (callbackCount === 3) {
        // db => unsaved col
        expect(lines).toBeTruthy();
        expect(lines.length).toBe(3);
        expect(lines[1].isNew).toBe(false);
        expect(lines[2].type).toBe('collection');
        expect(lines[2].isNew).toBe(true);
        service.save(lines[2].id);
      } else if (callbackCount === 4) {
        expect(lines[2].isNew).toBe(false);
        expect(createCol).toHaveBeenCalled();
        done();
      }
    });
    service.load('dummy');
  });
});
