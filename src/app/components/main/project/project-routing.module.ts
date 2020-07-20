
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectListComponent } from './project-list/project-list.component';


const routes: Routes = [
  {
    path : '',
    component : ProjectComponent,
    children: [
      {
        path: 'project-list',
        component: ProjectListComponent
      },
      {
        path: '',
        redirectTo: 'project-list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }