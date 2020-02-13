import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatabaseEditorComponent } from './database/database-editor/database-editor.component';
import { UserTableComponent } from './user/user-table/user-table.component';


const routes: Routes = [
  { path: '', redirectTo: 'database', pathMatch: 'full' },
  { path: 'database', component: DatabaseEditorComponent },
  { path: 'users', component: UserTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
