import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'meeting',
        loadChildren: () => import('./meeting/meeting.module').then(m => m.MeetingModule),
      },
      {
        path: 'meeting-minutes',
        loadChildren: () => import('./meeting-minutes/meeting-minutes.module').then(m => m.MeetingMinutesModule),
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      // {
      //   path: 'transcriber',
      //   loadChildren: () => import('./transcriber-tool/transcriber-tool.module').then(m => m.TranscriberToolModule),
      // },
      {
        path: '',
        redirectTo: 'meeting',
        pathMatch: 'full'
      }
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
