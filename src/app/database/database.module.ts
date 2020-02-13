import { NgModule } from '@angular/core';

import { AutoSizeInputModule } from 'ngx-autosize-input';

import { TreeService } from './services/tree.service';
import { CollectionLineComponent } from './collection-line/collection-line.component';
import { DatabaseEditorComponent } from './database-editor/database-editor.component';
import { DatabaseLineComponent } from './database-line/database-line.component';
import { DocumentLineComponent } from './document-line/document-line.component';
import { FieldLineComponent } from './field-line/field-line.component';
import { TreeColComponent } from './tree-col/tree-col.component';
import { TreeColumnsComponent } from './tree-columns/tree-columns.component';
import { SharedModule } from '../shared/shared.module';
import { LetterButtonComponent } from './letter-button/letter-button.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    CollectionLineComponent,
    DatabaseEditorComponent,
    DatabaseLineComponent,
    DocumentLineComponent,
    FieldLineComponent,
    LetterButtonComponent,
    TreeColComponent,
    TreeColumnsComponent
  ],
  imports: [
    AutoSizeInputModule,
    CoreModule,
    SharedModule
  ],
  exports: [
    DatabaseEditorComponent
  ],
  providers: [
    TreeService
  ]
})
export class DatabaseModule { }
