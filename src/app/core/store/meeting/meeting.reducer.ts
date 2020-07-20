import { MeetingState } from './meeting.state';
import * as MeetingActions from './meeting.actions';
import { createReducer, on, Action } from '@ngrx/store';

const initialState: MeetingState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: '',
  sort: null,
  selectedItem: {
    meetingId: 0,
    users: []
  },
  typeLoading: 'list-loading'
};

const reducer = createReducer(
  initialState,
  on(MeetingActions.getMeetings, (state) => {
    return { ...state, status: 'loading', typeLoading: 'list-loading' }
  }),
  on(MeetingActions.getMeetingsSuccess, (state, action) => {
    return { ...state, status: 'idle', items: action.items }
  }),
  on(MeetingActions.getMeetingsFailed, (state, action) => {
    return { ...state, status: 'error', items: [], error: action?.error || '' }
  }),
  on(MeetingActions.getMeetingAttendees, (state, action) => {
    return { ...state, status: 'loading', typeLoading: 'attendees-loading' }
  }),
  on(MeetingActions.getMeetingAttendeesSuccess, (state, action) => {
    let selectedItem = {
      users: action.users,
      meetingId: action.meetingId
    }
    return { ...state, status: 'idle', selectedItem }
  }),
  on(MeetingActions.getMeetingAttendeesFailed, (state, action) => {
    return { ...state, status: 'error', error: action.error || '' }
  }),
  on(MeetingActions.updateMeetingList, (state, action) => {
    return { ...state, status: 'idle', items: action.items }
  }),
  on(MeetingActions.ClearStateMeeting, (state) => {
    return { ...initialState }
  })
)
export function meetingReducer(
  state: MeetingState | undefined, action: Action
) {
  return reducer(state, action)
}