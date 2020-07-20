import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effect';
import { moduleReducer } from './store/module/module.reducer';
import { meetingReducer } from './store/meeting/meeting.reducer';
import { MeetingEffects } from './store/meeting/meeting.effect';
import { ProjectEffects } from './store/project/project.effect';
import { projectReducer } from './store/project/project.reducer';
import { usersReducer } from './store/user/users.reducer';
import { UsersEffect } from './store/user/users.effect';
import { meetingTranscriptReducer } from './store/transcriber-meeting/meeting-transcript.reducer';
import { MeetingTransriptEffects } from './store/transcriber-meeting/meeting-transcript.effect';
@NgModule({
  imports: [
    StoreModule.forFeature('feature_auth', authReducer),
    StoreModule.forFeature('feature_module', moduleReducer),
    StoreModule.forFeature('feature_meeting', meetingReducer),
    StoreModule.forFeature('feature_project', projectReducer),
    StoreModule.forFeature('feature_users', usersReducer),
    StoreModule.forFeature('feature_meeting_transcript', meetingTranscriptReducer),
    EffectsModule.forFeature([AuthEffects]),
    EffectsModule.forFeature([MeetingEffects]),
    EffectsModule.forFeature([ProjectEffects]),
    EffectsModule.forFeature([UsersEffect]),
    EffectsModule.forFeature([MeetingTransriptEffects]),
  ]
})
export class CoreModule { }
