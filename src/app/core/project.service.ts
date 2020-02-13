import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  projects = new Subject<Project[]>();
  selectedProject = new Subject<Project>();

  constructor(private http: HttpClient) {
    this.getProjects(undefined).subscribe(projects => {
      this.projects.next(projects);
      let proj: Project;
      if (projects.length > 0) {
        proj = projects[0];
      }
      this.selectedProject.next(proj);
    });
  }

  private getProjects(userId: string): Observable<Project[]> {
    const url = `${environment.baseUrl}/projects`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          return response.projects.map(prj => {
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
