import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Collection } from '../models/collection.model';
import { Document } from '../models/document.model';
import { Field } from '../models/field.model';
import { Database } from '../models/database.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DbDataService {

  constructor(private http: HttpClient) { }

  createCollection(col: Collection): Observable<boolean> {
    const url = `${environment.baseUrl}/collections`;
    return this.http.post<any>(url, col)
      .pipe(
        map(response => {
          if (response.data && response.data.collection) {
            col.id = response.data.collection._id;
            return true;
          }
          return false;
        })
      );
  }

  createDocument(doc: Document): Observable<boolean> {
    const url = `${environment.baseUrl}/documents`;
    return this.http.post<any>(url, doc)
      .pipe(
        map(response => {
          if (response.data && response.data.document) {
            doc.id = response.data.document._id;
            return true;
          }
          return false;
        })
      );
  }

  createField(fld: Field): Observable<boolean> {
    const url = `${environment.baseUrl}/fields`;
    return this.http.post<any>(url, fld)
      .pipe(
        map(response => {
          if (response.data && response.data.field) {
            fld.id = response.data.field._id;
            return true;
          }
          return false;
        })
      );
  }

  deleteCollection(collectionId: string): Observable<boolean> {
    const url = `${environment.baseUrl}/collections/${collectionId}`;
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  deleteDocument(documentId: string): Observable<boolean> {
    const url = `${environment.baseUrl}/documents/${documentId}`;
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  deleteField(id: string): Observable<boolean> {
    const url = `${environment.baseUrl}/fields/${id}`;
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  getCollection(id: string): Observable<Collection> {
    const url = `${environment.baseUrl}/collection/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.data && response.data.document) {
            const col = response.data.document;
            return {
              id: col._id,
              databaseId: col.databaseId,
              name: col.name
            };
          } else {
            return undefined;
          }
        })
      );
  }

  getCollections(databaseId: string): Observable<Collection[]> {
    const url = `${environment.baseUrl}/collections?databaseId=${databaseId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.documents.map(col => {
            return {
              id: col._id,
              name: col.name
            };
          });
        })
      );
  }

  getCollectionCount(databaseId: string): Observable<number> {
    const url = `${environment.baseUrl}/collections/count?databaseId=${databaseId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.count;
        })
      );
  }

  getDatabase(projectId: string): Observable<Database> {
    const url = `${environment.baseUrl}/databases?projectId=${projectId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          const db = response.data.documents[0];
          return {
            id: db._id,
            name: db.name
          };
        })
      );
  }

  getDocument(documentId: string): Observable<Document> {
    const url = `${environment.baseUrl}/document/${documentId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.data && response.data.document) {
            const doc = response.data.document;
            return {
              id: doc._id,
              collectionId: doc.collectionId,
              name: doc.name
            };
          } else {
            return undefined;
          }
        })
      );
  }

  getDocuments(collectionId: string): Observable<Document[]> {
    const url = `${environment.baseUrl}/documents?collectionId=${collectionId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.documents.map(doc => {
            return {
              id: doc._id,
              name: doc.name
            };
          });
        })
      );
  }

  getDocumentCount(collectionId: string): Observable<number> {
    const url = `${environment.baseUrl}/documents/count?collectionId=${collectionId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.count;
        })
      );
  }

  getField(id: string): Observable<Field> {
    const url = `${environment.baseUrl}/fields/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.data && response.data.document) {
            const fld = response.data.document;
            return {
              id: fld._id,
              documentId: fld.documentId,
              name: fld.name
            };
          } else {
            return undefined;
          }
        })
      );
  }

  getFields(documentId: string): Observable<Field[]> {
    const url = `${environment.baseUrl}/fields?documentId=${documentId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.data && response.data.documents) {
            return response.data.documents.map(fld => {
              return {
                id: fld._id,
                name: fld.name,
                value: fld.value
              };
            });
          } else {
            return undefined;
          }
        })
      );
  }

  getFieldCount(documentId: string): Observable<number> {
    const url = `${environment.baseUrl}/fields/count?documentId=${documentId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          if (response.data && response.data.count) {
            return response.data.count;
          } else {
            return undefined;
          }
        })
      );
  }

  updateCollection(col: Collection): Observable<boolean> {
    const url = `${environment.baseUrl}/collections/${col.id}`;
    return this.http.patch<any>(url, col)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  updateDatabase(db: Database): Observable<boolean> {
    const url = `${environment.baseUrl}/databases/${db.id}`;
    return this.http.patch<any>(url, db)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  updateDocument(doc: Document): Observable<boolean> {
    const url = `${environment.baseUrl}/documents/${doc.id}`;
    return this.http.patch<any>(url, doc)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }

  updateField(fld: Field): Observable<boolean> {
    const url = `${environment.baseUrl}/fields/${fld.id}`;
    return this.http.patch<any>(url, fld)
      .pipe(
        map(response => {
          return response.status.includes('success');
        })
      );
  }
}
