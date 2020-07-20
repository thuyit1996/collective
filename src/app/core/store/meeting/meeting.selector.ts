import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingState } from './meeting.state';

const featureMeeting = createFeatureSelector<MeetingState>('feature_meeting');

export const meetingsSelector = createSelector(featureMeeting, state => state.items);
export const meetingStatusSelector = createSelector(featureMeeting, state => state.status);
export const meetingsSelectedItem = createSelector(featureMeeting, state => state.selectedItem);
export const meetingsTypeLoadingSelector = createSelector(featureMeeting, state => state.typeLoading);
