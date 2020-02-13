import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { DbDataService } from '../db-data.service';

describe('DbDataService - Database', () => {
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

  it('should get databases', () => {
    const projectId = 'dummy';
    const url = `${environment.baseUrl}/databases?projectId=${projectId}`;
    service.getDatabase(projectId).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should update databases', () => {
    const db = {
      id: 'something',
      name: 'whatever'
    };
    const url = `${environment.baseUrl}/databases/${db.id}`;
    service.updateDatabase(db).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('PATCH');
  });
});
