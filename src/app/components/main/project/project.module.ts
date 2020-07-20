import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectComponent } from './project.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectListComponent } from './project-list/project-list.component';

import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';

@NgModule({
  declarations: [ProjectComponent, AddProjectComponent, ProjectListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProjectRoutingModule,


    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  entryComponents: [
    AddProjectComponent,
    
  ],
})
export class ProjectModule { }
