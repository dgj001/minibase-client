import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { Project } from '../core/models/project.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-toolbar-content',
  templateUrl: './toolbar-content.component.html',
  styleUrls: ['./toolbar-content.component.scss']
})
export class ToolbarContentComponent implements OnInit, OnDestroy {
  selectedProjectId$: Observable<string>;
  projects$: Observable<Project[]>;
  location: string;

  private routerSubs: Subscription;

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.routerSubs = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.length > 1) {
          const str = this.router.url.substring(1);
          this.location = str.charAt(0).toUpperCase() + str.substring(1);
        } else {
          this.location = '';
        }
      }
    });

    this.projects$ = this.projectService.projects;
    this.selectedProjectId$ = this.projectService.selectedProjectId;
  }

  ngOnDestroy() {
    if (this.routerSubs) {
      this.routerSubs.unsubscribe();
    }
  }

  changeProject(event: MatSelectChange) {
    this.projectService.setProjectId(event.value);
  }
}
