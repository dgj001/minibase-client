import { NgModule } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
  declarations: [
    UserDialogComponent,
    UserTableComponent
  ],
  imports: [
    CoreModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    UserTableComponent
  ]
})
export class UserModule { }
