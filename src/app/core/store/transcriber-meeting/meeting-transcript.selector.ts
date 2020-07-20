import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingTranscriptState } from './meeting-transcript.state';

export const featureMeetingTransript = createFeatureSelector<MeetingTranscriptState>('feature_meeting_transcript');
export const meetingTransriptSelector = createSelector(featureMeetingTransript, state => state.items);
export const meetingTransriptStatusSelector = createSelector(featureMeetingTransript, state => state.status);
export const meetingTransriptCurrentItemSelector = createSelector(featureMeetingTransript, state => state.currentItem);
