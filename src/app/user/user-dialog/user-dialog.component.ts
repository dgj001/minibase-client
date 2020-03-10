import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onCancelClick() {
    this.dialogRef.close();
  }
}
