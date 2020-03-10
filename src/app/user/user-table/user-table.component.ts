import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

import { ProjectUserService } from 'src/app/core/services/project-user.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { ProjectUser } from 'src/app/core/models/project-user.module';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  displayedColumns = ['email', 'createdAt'];
  dataSource = new MatTableDataSource<ProjectUser>();

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
      this.projectUserService.getProjectUsers(projectId).subscribe(users => {
        this.dataSource.data = users;
      });
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { name: 'testing' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
