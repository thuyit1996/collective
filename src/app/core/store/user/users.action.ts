import { createAction, props } from '@ngrx/store';
import { User } from '../../models/User';
export const GET_USERS = '@User/GetAll';
export const GET_USERS_SUCCESS = '@User/GetAllSuccess';
export const GET_USERS_FAILED = '@User/GetAllFailed';
export const GET_USER_FROFILE = '@User/GetUserProfile';
export const GET_USER_FROFILE_SUCCESS = '@User/GetUserProfileSuccess';
export const GET_USER_FROFILE_FAILED = '@User/GetUserProfileFiled';
export const CLEAR_STATE_USER = '@User/ClearStateUser';

export const getUsers = createAction(GET_USERS);
export const getUsersSuccess = createAction(GET_USERS_SUCCESS, props<{ users: User[] }>());
export const getUsersFailed = createAction(GET_USERS_FAILED, props<{ error?: string }>());
export const getUserProfile = createAction(GET_USER_FROFILE);
export const getUserProfileSuccess = createAction(GET_USER_FROFILE_SUCCESS, props<{ userProfile: any }>());
export const getUserProfileFailed = createAction(GET_USER_FROFILE_FAILED, props<{ error?: any }>());
export const clearStateUser = createAction(CLEAR_STATE_USER);
