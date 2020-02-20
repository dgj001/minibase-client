import { NgModule } from '@angular/core';
import { ProjectService } from './project.service';
import { HttpClientModule } from '@angular/common/http';
import { ProjectUserService } from './project-user.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ProjectService,
    ProjectUserService
  ]
})
export class CoreModule { }
