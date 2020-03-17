import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

import { ProjectUserService } from 'src/app/core/services/project-user.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ProjectUser } from 'src/app/core/models/project-user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  displayedColumns = ['email', 'createdAt'];
  dataSource = new MatTableDataSource<ProjectUser>();
  private projectId: string;

  constructor(
    private projectUserService: ProjectUserService,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.projectService.selectedProjectId.subscribe(projectId => {
      if (projectId === undefined) {
        return;
      }
      this.projectId = projectId;
      this.fetchProjectUsers();
    });
  }

  private fetchProjectUsers() {
    this.projectUserService.getProjectUsers(this.projectId).subscribe(users => {
      this.dataSource.data = users;
    });
  }

  addUser() {
    const projUser: ProjectUser = {
      projectId: this.projectId,
      email: '',
      password: ''
    };
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: projUser
    });

    dialogRef.afterClosed().subscribe(() => {
      this.projectUserService.signUp(projUser).subscribe(result => {
        if (result) {
          this.fetchProjectUsers();
        }
      });
    });
  }
}
