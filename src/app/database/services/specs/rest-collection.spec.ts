import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DbDataService } from '../db-data.service';
import { environment } from 'src/environments/environment';

describe('DbDataService - Collection', () => {
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

  it('should get collections', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        documents: [
          { _id: 'id1', name: 'col1' },
          { _id: 'id2', name: 'col2' }
        ]
      }
    };

    service.getCollections('dummy').subscribe(collections => {
      expect(collections.length).toBe(fakeResponse.data.documents.length);
      expect(collections[0].id).toBe(fakeResponse.data.documents[0]._id);
      expect(collections[1].name).toBe(fakeResponse.data.documents[1].name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collections?databaseId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get single collection', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        document: { _id: 'id1', name: 'col1' }
      }
    };

    service.getCollection('dummy').subscribe(col => {
      expect(col).toBeTruthy();
      expect(col.id).toBe(fakeResponse.data.document._id);
      expect(col.name).toBe(fakeResponse.data.document.name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collection/dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get collection counts', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        count: 3
      }
    };

    service.getCollectionCount('dummy').subscribe(count => {
      expect(count).toBe(fakeResponse.data.count);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collections/count?databaseId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should create collections', () => {
    const collection = {
      id: 'new',
      databaseId: 'n/a',
      name: 'whatever'
    };

    const fakeResponse = {
      status: 'successful',
      data: {
        collection: {
          id: 'created id',
          name: 'created name'
        }
      }
    };

    service.createCollection(collection).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collections`);
    expect(req.request.method).toEqual('POST');
    req.flush(fakeResponse);
  });

  it('should delete collections', () => {
    const fakeResponse = {
      status: 'success'
    };

    service.deleteCollection('dummy').subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collections/dummy`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(fakeResponse);
  });

  it('should update collections', () => {
    const fakeResponse = {
      status: 'success'
    };

    service.updateCollection({ id: 'dummy', databaseId: 'dummy', name: 'whatever' }).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/collections/dummy`);
    expect(req.request.method).toEqual('PATCH');
    req.flush(fakeResponse);
  });

});
