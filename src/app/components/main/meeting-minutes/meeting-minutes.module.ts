import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingMinutesComponent } from './meeting-minutes.component';
import { MeetingMinutesRoutingModule } from './meeing-minutes.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { MeetingMinutesLoadingComponent } from './meeting-minutes-loading/meeting-minutes-loading.component';



@NgModule({
  declarations: [MeetingMinutesComponent, MeetingMinutesLoadingComponent, ],
  imports: [
    CommonModule,
    MeetingMinutesRoutingModule,
    SharedModule,
    CKEditorModule,
  ]
})
export class MeetingMinutesModule { }
