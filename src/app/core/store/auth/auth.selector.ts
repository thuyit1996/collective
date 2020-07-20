import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('feature_auth');
export const selectUser = createSelector(selectAuthState, state => state.user);
export const selectUserStatus = createSelector(selectAuthState, state => state.status);
export const selectUserError = createSelector(selectAuthState, state => state.error);
export const selectIsRegister = createSelector(selectAuthState, state => state.isRegister);
export const selectRegisterPayload = createSelector(selectAuthState, state => state.registerPayload);
