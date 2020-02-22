import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { DbDataService } from '../db-data.service';

describe('DbDataService - Document', () => {
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

  it('should get a single document', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        document: { _id: 'id1', name: 'doc1' }
      }
    };

    service.getDocument('dummy').subscribe(doc => {
      expect(doc).toBeTruthy();
      expect(doc.id).toBe(fakeResponse.data.document._id);
      expect(doc.name).toBe(fakeResponse.data.document.name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/document/dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get documents', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        documents: [
          { _id: 'id1', name: 'doc1' },
          { _id: 'id2', name: 'doc2' }
        ]
      }
    };

    service.getDocuments('dummy').subscribe(docs => {
      expect(docs.length).toBe(fakeResponse.data.documents.length);
      expect(docs[0].id).toBe(fakeResponse.data.documents[0]._id);
      expect(docs[1].name).toBe(fakeResponse.data.documents[1].name);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/documents?collectionId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should get document counts', () => {
    const fakeResponse = {
      status: 'success',
      data: {
        count: 4
      }
    };

    service.getDocumentCount('dummy').subscribe(count => {
      expect(count).toBe(fakeResponse.data.count);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/documents/count?collectionId=dummy`);
    expect(req.request.method).toEqual('GET');
    req.flush(fakeResponse);
  });

  it('should create documents', () => {
    const document = {
      id: 'new',
      collectionId: 'n/a',
      name: 'whatever'
    };

    const fakeResponse = {
      status: 'success',
      data: {
        document: {
          _id: 'created id',
          name: 'created name'
        }
      }
    };

    service.createDocument(document).subscribe(result => {
      expect(result).toBe(true);
      expect(document.id).toBe(fakeResponse.data.document._id);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/documents`);
    expect(req.request.method).toEqual('POST');
    req.flush(fakeResponse);
  });

  it('should delete documents', () => {
    const fakeResponse = {
      status: 'success'
    };

    service.deleteDocument('dummy').subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/documents/dummy`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(fakeResponse);
  });

  it('should update documents', () => {
    const fakeResponse = {
      status: 'success'
    };

    service.updateDocument({ id: 'dummy', collectionId: 'dummy', name: 'whatever' }).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/documents/dummy`);
    expect(req.request.method).toEqual('PATCH');
    req.flush(fakeResponse);
  });
});
