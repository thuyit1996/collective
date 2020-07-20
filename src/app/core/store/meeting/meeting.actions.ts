import { createAction, props, ActionType } from '@ngrx/store';
import { Meeting } from '../../models/Meeting';
import { User } from '../../models/User';

export const GET_MEETINGS = '@Meeting/GetAll';
export const GET_MEETINGS_SUCCESS = '@Meeting/GetMeetingSuccess';
export const GET_MEETINGS_FAILED = '@Meeting/GetMeetingFailed';
export const GET_MEETING_ATTENTDEES = '@Meeting/getMeetingAttendees';
export const GET_MEETING_ATTENTDEES_SUCCESS = '@Meeting/getMeetingAttendeesSuccess';
export const GET_MEETING_ATTENTDEES_FAILED = '@Meeting/getMeetingAttendeesFailed';
export const UPDATE_MEETINGS_LIST = '@Meeting/UpdateMeetingList';
export const CLEAR_STATE_MEETING = '@Meeting/ClearStateMeeting';

export const getMeetings = createAction(GET_MEETINGS);
export const getMeetingsSuccess = createAction(GET_MEETINGS_SUCCESS, props<{ items: Meeting[] }>());
export const getMeetingsFailed = createAction(GET_MEETINGS_FAILED, props<{ error?: string }>());
export const getMeetingAttendees = createAction(GET_MEETING_ATTENTDEES, props<{ meetingId: number }>());
export const getMeetingAttendeesSuccess = createAction(GET_MEETING_ATTENTDEES_SUCCESS, props<{ users: User[], meetingId: number }>());
export const getMeetingAttendeesFailed = createAction(GET_MEETING_ATTENTDEES_FAILED, props<{ error?: string }>());
export const updateMeetingList = createAction(UPDATE_MEETINGS_LIST, props<{ items: Meeting[] }>());
export const ClearStateMeeting = createAction(CLEAR_STATE_MEETING);