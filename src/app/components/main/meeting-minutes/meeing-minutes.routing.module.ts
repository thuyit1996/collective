import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingMinutesComponent } from './meeting-minutes.component';


const routes: Routes = [
  {
    path: '',
    component: MeetingMinutesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingMinutesRoutingModule { }
