import { NgModule } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UserTableComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    UserTableComponent
  ]
})
export class UserModule { }
