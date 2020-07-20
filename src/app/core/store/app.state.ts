import { AuthState } from './auth/auth.state';
import { ModuleState } from './module/module.state';
import { MeetingState } from './meeting/meeting.state';
import { ProjectState } from './project/project.state';
import { UsersState } from './user/users.state';
import { MeetingTranscriptState } from './transcriber-meeting/meeting-transcript.state'

export interface AppState {
  feature_auth: AuthState;
  feature_module: ModuleState;
  feature_meeting: MeetingState;
  feature_project: ProjectState;
  feature_users: UsersState,
  feature_meeting_transcript: MeetingTranscriptState
}
