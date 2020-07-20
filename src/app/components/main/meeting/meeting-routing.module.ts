import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingComponent } from './meeting.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';


const routes: Routes = [
  {
    path: '',
    component: MeetingComponent,
    children: [
      {
        path: 'meeting-list',
        component: MeetingListComponent
      },
      {
        path: '',
        redirectTo: 'meeting-list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule { }
