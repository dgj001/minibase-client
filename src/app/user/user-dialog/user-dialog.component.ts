import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectUser } from 'src/app/core/models/project-user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public projUser: ProjectUser
  ) { }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    this.projUser.email = form.value.email;
    this.projUser.password = form.value.password;
    this.dialogRef.close(this.projUser);
  }
}
