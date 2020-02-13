import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DbDataService } from '../../services/db-data.service';
import { Field } from '../field.model';
import { FieldNodeData } from '../field-node-data.model';

describe('FieldNodeData', () => {
  let field: Field;
  let dbDataService: DbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DbDataService]
    });

    field = {
      id: 'fldid',
      documentId: 'docid',
      name: 'original'
    };

    dbDataService = TestBed.inject(DbDataService);
    spyOn(dbDataService, 'getField').and.returnValue(of(field));
  });

  it('should have a field payload and type', (done) => {
    FieldNodeData.get('fldid', dbDataService).subscribe(nodeData => {
      expect(nodeData.getObject().id).toBe('fldid');
      expect(nodeData.getObject().name).toBe('original');
      expect(nodeData.getType()).toBe('field');
      expect(nodeData.needToFecthChildren()).toBe(false);
      done();
    });
  });

  it('should not delete if local', (done) => {
    const nodeData = new FieldNodeData(field, dbDataService);
    const deleteFld = spyOn(dbDataService, 'deleteField');
    nodeData.delete().subscribe(result => {
      expect(result).toBe(false);
      expect(deleteFld).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not delete if remote', (done) => {
    const deleteFld = spyOn(dbDataService, 'deleteField').and.returnValue(of(true));
    FieldNodeData.get('fldid', dbDataService).subscribe(nodeData => {
      nodeData.delete().subscribe(result => {
        expect(result).toBe(true);
        expect(deleteFld).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should revert values', (done) => {
    FieldNodeData.get('fldid', dbDataService).subscribe(nodeData => {
      nodeData.getObject().name = 'changed';
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('original');
      done();
    });
  });

  it('should create a record upon save if created', (done) => {
    const createFld = spyOn(dbDataService, 'createField').and.returnValue(of(true));

    const nodeData = new FieldNodeData(field, dbDataService);
    expect(nodeData.isNew()).toBe(true);

    nodeData.getObject().name = 'modified';
    nodeData.save().subscribe(result => {
      expect(result).toBe(true);
      expect(nodeData.isNew()).toBe(false);
      expect(createFld).toHaveBeenCalledWith(field);

      // Can't revert after save
      nodeData.revert();
      expect(nodeData.getObject().name).toBe('modified');

      done();
    });
  });

  it('should update a record upon save', (done) => {
    const updateFld = spyOn(dbDataService, 'updateField').and.returnValue(of(true));

    FieldNodeData.get('fldid', dbDataService).subscribe(nodeData => {
      expect(nodeData.isNew()).toBe(false);
      nodeData.getObject().name = 'modified';
      nodeData.save().subscribe(result => {
        expect(result).toBe(true);
        expect(updateFld).toHaveBeenCalledWith(field);

        // Can't revert after save
        nodeData.revert();
        expect(nodeData.getObject().name).toBe('modified');

        done();
      });
    });
  });
});
