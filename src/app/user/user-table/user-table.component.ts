import { Component, OnInit } from '@angular/core';
import { ProjectUserService } from 'src/app/core/project-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectUser } from 'src/app/core/project-user.module';
import { ProjectService } from 'src/app/core/project.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  displayedColumns = ['email'];
  dataSource = new MatTableDataSource<ProjectUser>();

  constructor(
    private projectUserService: ProjectUserService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectService.selectedProjectId.subscribe(projectId => {
      if (projectId === undefined) {
        return;
      }
      this.projectUserService.getProjectUsers(projectId).subscribe(users => {
        this.dataSource.data = users;
      });
    });
  }
}
