import { MeetingTranscriptState } from './meeting-transcript.state';
import * as MeetingTranscriptActions from './meeting-transcript.actions';
import { createReducer, on, Action } from '@ngrx/store';

const initialState: MeetingTranscriptState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: '',
};

const reducer = createReducer(
  initialState,
  on(MeetingTranscriptActions.getMeetingTranscript, (state, action) => {
    return { ...state, status: 'loading' }
  }),
  on(MeetingTranscriptActions.GetMeetingTransriptSuccess, (state, action) => {
    return { ...state, status: 'idle', error: '', items: action.items }
  }),
  on(MeetingTranscriptActions.GetMeetingTransriptFailed, (state, action) => {
    return { ...state, status: 'error', error: action.error || '', items: [] }
  }),
  on(MeetingTranscriptActions.ClearStateMeetingTranscript, () => {
    return { ...initialState }
  })
)
export function meetingTranscriptReducer(
  state: MeetingTranscriptState | undefined, action: Action
) {
  return reducer(state, action)
}