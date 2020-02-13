import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DbDataService } from '../../services/db-data.service';
import { Collection } from '../collection.model';
import { CollectionNodeData } from '../collection-node-data.model';

describe('CollectionNodeData', () => {
  let collection: Collection;
  let dbDataService: DbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DbDataService]
    });

    collection = {
      id: 'colid',
      databaseId: 'dbid',
      name: 'original'
    };

    dbDataService = TestBed.inject(DbDataService);
    spyOn(dbDataService, 'getCollection').and.returnValue(of(collection));
  });

  it('should have a collection payload and type', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('colid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.getType()).toBe('collection');
      expect(nodeData.needToFecthChildren()).toBe(false);
      done();
    });
  });

  it('should get a collection with documents', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(1));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('colid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.needToFecthChildren()).toBe(true);
      done();
    });
  });

  it('should not create a child if it needs to fetch children', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(1));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeUndefined();
      done();
    });
  });

  it('should create a child if it does not need to fetch children', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeTruthy();
      done();
    });
  });

  it('should not delete if local', (done) => {
    const nodeData = new CollectionNodeData(collection, dbDataService);
    const deleteCol = spyOn(dbDataService, 'deleteCollection');
    nodeData.delete().subscribe(result => {
      expect(result).toBe(false);
      expect(deleteCol).not.toHaveBeenCalled();
      done();
    });
  });

  it('should delete if remote', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    const deleteCol = spyOn(dbDataService, 'deleteCollection').and.returnValue(of(true));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      nodeData.delete().subscribe(result => {
        expect(result).toBe(true);
        expect(deleteCol).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should fetch children', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(2));
    const getDocuments = spyOn(dbDataService, 'getDocuments').and.returnValue(of([
      { id: 'docid1', collectionId: 'colid1', name: 'docname1' },
      { id: 'docid2', collectionId: 'colid1', name: 'docname2' }
    ]));
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(1));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.needToFecthChildren()).toBe(true);
      nodeData.fetchChildren().subscribe(childNodeData => {
        expect(nodeData.needToFecthChildren()).toBe(false);
        expect(getDocuments).toHaveBeenCalledWith(collection.id);
        expect(childNodeData).toBeTruthy();
        expect(childNodeData.length).toBe(2);
        done();
      });
    });
  });

  it('should revert values', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      nodeData.getObject().name = 'changed';
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('original');
      done();
    });
  });

  it('should create a record upon save if created', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    const createCol = spyOn(dbDataService, 'createCollection').and.returnValue(of(true));

    const nodeData = new CollectionNodeData(collection, dbDataService);
    expect(nodeData.isNew()).toBe(true);

    nodeData.getObject().name = 'modified';
    nodeData.save().subscribe(result => {
      expect(result).toBe(true);
      expect(createCol).toHaveBeenCalledWith(collection);
      expect(nodeData.isNew()).toBe(false);

      // Can't revert after save
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('modified');

      done();
    });
  });

  it('should update a record upon save', (done) => {
    spyOn(dbDataService, 'getDocumentCount').and.returnValue(of(0));
    const updateCol = spyOn(dbDataService, 'updateCollection').and.returnValue(of(true));

    CollectionNodeData.get('colid', dbDataService).subscribe(nodeData => {
      expect(nodeData.isNew()).toBe(false);
      nodeData.getObject().name = 'modified';
      nodeData.save().subscribe(result => {
        expect(result).toBe(true);
        expect(updateCol).toHaveBeenCalledWith(collection);

        // Can't revert after save
        nodeData.revert();
        expect(nodeData.getObject().name).toBe('modified');

        done();
      });
    });
  });
});
