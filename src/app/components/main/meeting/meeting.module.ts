import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingComponent } from './meeting.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { SharedModule } from '../../../shared/shared.module';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MeetingService } from '../../../core/services/meeting.service';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';
import { TranscriberMeetingService } from '../../../core/services/transcriber-meeting.service';

@NgModule({
  declarations: [
    MeetingComponent,
    AddMeetingComponent,
    MeetingListComponent,
  ],
  imports: [
    CommonModule,
    MeetingRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  entryComponents: [
    AddMeetingComponent,
  ],
  providers: [
    MeetingService,
    TranscriberMeetingService
  ]
})
export class MeetingModule { }
