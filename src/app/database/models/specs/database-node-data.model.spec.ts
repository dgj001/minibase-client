import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DbDataService } from '../../services/db-data.service';
import { Database } from '../database.model';
import { DatabaseNodeData } from '../database-node-data.model';

describe('DatabaseNodeData', () => {
  let database: Database;
  let dbDataService: DbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DbDataService]
    });

    database = {
      id: 'dbid',
      name: 'original'
    };

    dbDataService = TestBed.inject(DbDataService);
    spyOn(dbDataService, 'getDatabase').and.returnValue(of(database));
  });

  it('should have a database payload and type', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(0));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('dbid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.getType()).toBe('database');
      expect(nodeData.needToFecthChildren()).toBe(false);
      expect(nodeData.isNew()).toBe(false);
      done();
    });
  });

  it('should get a database with collections', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(1));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('dbid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.needToFecthChildren()).toBe(true);
      done();
    });
  });

  it('should not create a child if it needs to fetch children', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(1));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeUndefined();
      done();
    });
  });

  it('should create a child if it does not need to fetch children', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(0));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeTruthy();
      done();
    });
  });

  it('should fetch children', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(2));
    const getCollections = spyOn(dbDataService, 'getCollections').and.returnValue(of([
      { id: 'fetchid1', databaseId: 'dbid1', name: 'fetchname1' },
      { id: 'fetchid2', databaseId: 'dbid2', name: 'fetchname2' }
    ]));
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(1));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      expect(nodeData.needToFecthChildren()).toBe(true);
      nodeData.fetchChildren().subscribe(childNodeData => {
        expect(nodeData.needToFecthChildren()).toBe(false);
        expect(getCollections).toHaveBeenCalledWith(database.id);
        expect(childNodeData).toBeTruthy();
        expect(childNodeData.length).toBe(2);
        done();
      });
    });
  });

  it('should revert values', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(0));
    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      const db = nodeData.getObject();
      db.name = 'changed';
      nodeData.revert();
      expect(db.name).toBe('original');
      done();
    });
  });

  it('should update a record upon save', (done) => {
    spyOn(dbDataService, 'getCollectionCount').and.returnValue(of(0));
    const updateDb = spyOn(dbDataService, 'updateDatabase').and.returnValue(of(true));

    DatabaseNodeData.get('dbid', dbDataService).subscribe(nodeData => {
      const db = nodeData.getObject();
      db.name = 'modified';
      nodeData.save().subscribe(result => {
        expect(updateDb).toHaveBeenCalledWith(database);

        // Can't revert after save
        nodeData.revert();
        expect(db.name).toBe('modified');

        done();
      });
    });
  });
});
