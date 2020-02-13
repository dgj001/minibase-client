import { NgModule } from '@angular/core';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { RoundIconButtonComponent } from './round-icon-button/round-icon-button.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IconButtonComponent,
    RoundIconButtonComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    IconButtonComponent,
    RoundIconButtonComponent
  ]
})
export class SharedModule { }
