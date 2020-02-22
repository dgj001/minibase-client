import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  projects = new Subject<Project[]>();
  selectedProjectId = new BehaviorSubject<string>(undefined);

  private _selectedProjectId: string;

  constructor(private http: HttpClient) {
    this.getProjects(undefined).subscribe(projects => {
      this.projects.next(projects);
      if (projects.length > 0) {
        this._selectedProjectId = projects[0].id;
      }
      this.selectedProjectId.next(this._selectedProjectId);
    });
  }

  setProjectId(projectId: string) {
    this._selectedProjectId = projectId;
    this.selectedProjectId.next(projectId);
  }

  private getProjects(userId: string): Observable<Project[]> { // move to db-data?
    const url = `${environment.baseUrl}/projects`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.data.documents.map(prj => {
            return {
              id: prj._id,
              name: prj.name,
              userId: prj.userId
            };
          });
        })
      );
  }
}
