import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { ToolbarContentComponent } from './toolbar-content/toolbar-content.component';
import { UserModule } from './user/user.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ToolbarContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LayoutModule,
    CoreModule,
    DatabaseModule,
    MaterialModule,
    SharedModule,
    UserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
