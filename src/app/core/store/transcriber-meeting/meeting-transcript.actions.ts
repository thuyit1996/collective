import { createAction, props } from '@ngrx/store';
import { MeetingTranscriptItem } from '../../models/MeetingTranscriptItem';

export const GET_MEETING_TRANSCRIPT = '@TranscriberMeeting/GetAll';
export const GET_MEETING_TRANSCRIPT_SUCCESS = '@TranscriberMeeting/GetMeetingTransriptSuccess';
export const GET_MEETING_TRANSCRIPT_FAILED = '@TranscriberMeeting/GetMeetingTransriptFailed';
export const CLEAR_STATE_MEETING_TRANSCRIPT = '@TranscriberMeeting/ClearStateMeetingTranscript';

export const getMeetingTranscript = createAction(GET_MEETING_TRANSCRIPT);
export const GetMeetingTransriptSuccess = createAction(GET_MEETING_TRANSCRIPT_SUCCESS, props<{ items: MeetingTranscriptItem[] }>());
export const GetMeetingTransriptFailed = createAction(GET_MEETING_TRANSCRIPT_FAILED, props<{ error?: string }>());
export const ClearStateMeetingTranscript = createAction(CLEAR_STATE_MEETING_TRANSCRIPT);
