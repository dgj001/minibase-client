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
          if (response.createdCollection) {
            col.id = response.createdCollection._id;
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
          if (response.createdDocument) {
            doc.id = response.createdDocument._id;
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
          if (response.createdField) {
            fld.id = response.createdField._id;
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
          return response.status.includes('successful');
        })
      );
  }

  deleteDocument(documentId: string): Observable<boolean> {
    const url = `${environment.baseUrl}/documents/${documentId}`;
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          return response.status.includes
            ('successful');
        })
      );
  }

  deleteField(id: string): Observable<boolean> {
    const url = `${environment.baseUrl}/fields/${id}`;
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          return response.status.includes
            ('successful');
        })
      );
  }

  getCollection(id: string): Observable<Collection> {
    const url = `${environment.baseUrl}/collection/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return {
            id: response.collection._id,
            databaseId: response.collection.databaseId,
            name: response.collection.name
          };
        })
      );
  }

  getCollections(databaseId: string): Observable<Collection[]> {
    const url = `${environment.baseUrl}/collections?databaseId=${databaseId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.collections.map(col => {
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
          return response.count;
        })
      );
  }

  getDatabase(projectId: string): Observable<Database> {
    const url = `${environment.baseUrl}/databases?projectId=${projectId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          const db = response.databases[0];
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
          return {
            id: response.document._id,
            collectionId: response.document.collectionId,
            name: response.document.name
          };
        })
      );
  }

  getDocuments(collectionId: string): Observable<Document[]> {
    const url = `${environment.baseUrl}/documents?collectionId=${collectionId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.documents.map(doc => {
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
          return response.count;
        })
      );
  }

  getField(id: string): Observable<Field> {
    const url = `${environment.baseUrl}/fields/${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return {
            id: response.field._id,
            documentId: response.field.documentId,
            name: response.field.name
          };
        })
      );
  }

  getFields(documentId: string): Observable<Field[]> {
    const url = `${environment.baseUrl}/fields?documentId=${documentId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.fields.map(fld => {
            return {
              id: fld._id,
              name: fld.name,
              value: fld.value
            };
          });
        })
      );
  }

  getFieldCount(documentId: string): Observable<number> {
    const url = `${environment.baseUrl}/fields/count?documentId=${documentId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.count;
        })
      );
  }

  updateCollection(col: Collection): Observable<boolean> {
    const url = `${environment.baseUrl}/collections/${col.id}`;
    return this.http.patch<any>(url, col)
      .pipe(
        map(response => {
          return response.status.includes('successful');
        })
      );
  }

  updateDatabase(db: Database): Observable<boolean> {
    const url = `${environment.baseUrl}/databases/${db.id}`;
    return this.http.patch<any>(url, db)
      .pipe(
        map(response => {
          return response.status.includes('successful');
        })
      );
  }

  updateDocument(doc: Document): Observable<boolean> {
    const url = `${environment.baseUrl}/documents/${doc.id}`;
    return this.http.patch<any>(url, doc)
      .pipe(
        map(response => {
          return response.status.includes('successful');
        })
      );
  }

  updateField(fld: Field): Observable<boolean> {
    const url = `${environment.baseUrl}/fields/${fld.id}`;
    return this.http.patch<any>(url, fld)
      .pipe(
        map(response => {
          return response.status.includes('successful');
        })
      );
  }
}
