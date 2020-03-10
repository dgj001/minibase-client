import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from './services/project.service';
import { ProjectUserService } from './services/project-user.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ProjectService,
    ProjectUserService
  ]
})
export class CoreModule { }
