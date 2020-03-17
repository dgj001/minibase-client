import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProjectUser } from '../models/project-user.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProjectUserService {
  constructor(private http: HttpClient) { }

  public getProjectUsers(projectId: string): Observable<ProjectUser[]> { // move to db-data?
    const url = `${environment.baseUrl}/projectUsers?projectId=${projectId}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.documents.map(prjUser => {
            return {
              id: prjUser._id,
              email: prjUser.email,
              createdAt: prjUser.createdAt
            };
          });
        })
      );
  }

  public signUp(projUser: ProjectUser): Observable<boolean> {
    const url = `${environment.baseUrl}/projectUsers`;
    return this.http.post<any>(url, projUser)
      .pipe(
        map(response => {
          if (response.data && response.data.projectUser) {
            projUser.id = response.data.projectUser._id;
            return true;
          }
          return false;
        })
      );
  }
}
