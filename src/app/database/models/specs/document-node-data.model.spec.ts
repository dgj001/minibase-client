import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DbDataService } from '../../services/db-data.service';
import { Document } from '../document.model';
import { DocumentNodeData } from '../document-node-data.model';

describe('DocumentNodeData', () => {
  let document: Document;
  let dbDataService: DbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DbDataService]
    });

    document = {
      id: 'docid',
      collectionId: 'colid',
      name: 'original'
    };

    dbDataService = TestBed.inject(DbDataService);
    spyOn(dbDataService, 'getDocument').and.returnValue(of(document));
  });

  it('should have a document payload and type', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('docid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.getType()).toBe('document');
      expect(nodeData.needToFecthChildren()).toBe(false);
      done();
    });
  });

  it('should get a document with documents', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(1));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('docid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.needToFecthChildren()).toBe(true);
      done();
    });
  });

  it('should not create a child if it needs to fetch children', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(1));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeUndefined();
      done();
    });
  });

  it('should create a child if it does not need to fetch children', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      expect(nodeData.createChild()).toBeTruthy();
      done();
    });
  });

  it('should not delete if local', (done) => {
    const nodeData = new DocumentNodeData(document, dbDataService);
    const deleteDoc = spyOn(dbDataService, 'deleteDocument');
    nodeData.delete().subscribe(result => {
      expect(result).toBe(false);
      expect(deleteDoc).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not delete if remote', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    const deleteDoc = spyOn(dbDataService, 'deleteDocument').and.returnValue(of(true));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      nodeData.delete().subscribe(result => {
        expect(result).toBe(true);
        expect(deleteDoc).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should fetch children', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(2));
    const getFields = spyOn(dbDataService, 'getFields').and.returnValue(of([
      { id: 'fldid1', documentId: 'docid', name: 'fldname1' },
      { id: 'fldid2', documentId: 'docid', name: 'fldname2' }
    ]));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      expect(nodeData.needToFecthChildren()).toBe(true);
      nodeData.fetchChildren().subscribe(childNodeData => {
        expect(nodeData.needToFecthChildren()).toBe(false);
        expect(getFields).toHaveBeenCalledWith(document.id);
        expect(childNodeData).toBeTruthy();
        expect(childNodeData.length).toBe(2);
        done();
      });
    });
  });

  it('should revert values', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      nodeData.getObject().name = 'changed';
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('original');
      done();
    });
  });

  it('should create a record upon save if created', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    const createDoc = spyOn(dbDataService, 'createDocument').and.returnValue(of(true));

    const nodeData = new DocumentNodeData(document, dbDataService);
    expect(nodeData.isNew()).toBe(true);

    nodeData.getObject().name = 'modified';
    nodeData.save().subscribe(result => {
      expect(result).toBe(true);
      expect(nodeData.isNew()).toBe(false);
      expect(createDoc).toHaveBeenCalledWith(document);

      // Can't revert after save
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('modified');

      done();
    });
  });

  it('should update a record upon save', (done) => {
    spyOn(dbDataService, 'getFieldCount').and.returnValue(of(0));
    const updateCol = spyOn(dbDataService, 'updateDocument').and.returnValue(of(true));

    DocumentNodeData.get('docid', dbDataService).subscribe(nodeData => {
      nodeData.getObject().name = 'modified';
      expect(nodeData.isNew()).toBe(false);
      nodeData.save().subscribe(result => {
        expect(result).toBe(true);
        expect(updateCol).toHaveBeenCalledWith(document);

        // Can't revert after save
        nodeData.revert();
        expect(nodeData.getObject().name).toBe('modified');

        done();
      });
    });
  });
});
