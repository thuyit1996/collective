import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

const featureUsers = createFeatureSelector<UsersState>('feature_users');

export const getUsersList = createSelector(featureUsers, state => state.users);
export const usersStatusSelector = createSelector(featureUsers, state => state.status);
export const userProfileSelector = createSelector(featureUsers, state => state.userProfile);
