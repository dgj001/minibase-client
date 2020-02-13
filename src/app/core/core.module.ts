import { NgModule } from '@angular/core';
import { ProjectService } from './project.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [ProjectService]
})
export class CoreModule { }
