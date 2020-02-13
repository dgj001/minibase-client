import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { DbDataService } from '../db-data.service';

describe('DbDataService - Field', () => {
  let service: DbDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DbDataService]
    });

    service = TestBed.inject(DbDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get fields', () => {
    const fakeResponse = {
      status: 'ok',
      fields: [
        { _id: 'id1', name: 'fld1', value: 'val1' },
        { _id: 'id2', name: 'fld2', value: 'val2' }
      ]
    };

    service.getFields('dummy').subscribe(fields => {
      expect(fields.length).toBe(fakeResponse.fields.length);
      expect(fields[0].id).toBe(fakeResponse.fields[0]._id);
      expect(fields[1].name).toBe(fakeResponse.fields[1].name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields?documentId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get single field', () => {
    const fakeResponse = {
      status: 'ok',
      field: { _id: 'id1', name: 'fld1', value: 'val1' }
    };

    service.getField('dummy').subscribe(field => {
      expect(field.id).toBe(fakeResponse.field._id);
      expect(field.name).toBe(fakeResponse.field.name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields/dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get field counts', () => {
    const fakeResponse = {
      status: 'ok',
      count: 4
    };

    service.getFieldCount('dummy').subscribe(count => {
      expect(count).toBe(fakeResponse.count);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields/count?documentId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should create fields', () => {
    const field = {
      id: 'new',
      documentId: 'docId',
      name: 'whatever',
      value: 'something'
    };

    const fakeResponse = {
      status: 'ok',
      createdField: {
        _id: 'created id',
        name: 'created name',
        value: 'created value'
      }
    };

    service.createField(field).subscribe(result => {
      expect(result).toBe(true);
      expect(field.id).toBe(fakeResponse.createdField._id);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields`);
    expect(req.request.method).toEqual('POST');
    req.flush(fakeResponse);
  });

  it('should delete fields', () => {
    const fakeResponse = {
      status: '/fields DELETE successful'
    };

    service.deleteField('dummy').subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields/dummy`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(fakeResponse);
  });

  it('should update fields', () => {
    const fakeResponse = {
      status: '/fields PATCH successful'
    };

    service.updateField({ id: 'dummy', documentId: 'docId', name: 'whatever', value: 'hello' }).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/fields/dummy`);
    expect(req.request.method).toEqual('PATCH');
    req.flush(fakeResponse);
  });
});
