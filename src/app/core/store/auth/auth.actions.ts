import { createAction, props, ActionType } from '@ngrx/store';
import { Auth } from '../../models/Auth';

export const LOGIN_USER = '@Auth/Login';
export const LOGIN_USER_SUCCESS = '@Auth/LoginSuccess';
export const LOGIN_USER_FAILED = '@Auth/LoginFailed';
export const REGISTER_USER = '@Auth/Register';
export const REGISTER_USER_SUCCESS = '@Auth/RegisterSuccess';
export const REGISTER_USER_FAILED = '@Auth/RegisterFailed';
export const LOG_OUT = '@Auth/Logout';
export const CLEAR_IS_REGISTER = '@Auth/ClearIsRegister';
export const CLEAR_STATE_AUTH = '@Auth/ClearStateAuth';

export const loginUser = createAction(LOGIN_USER, props<{ userPayload: Auth }>());

export const loginUserSuccess = createAction(LOGIN_USER_SUCCESS, props<{ user: any }>());

export const loginUserFailed = createAction(LOGIN_USER_FAILED, props<{ error?: string }>());

export const registerUser = createAction(REGISTER_USER, props<{ registerPayload?: any }>());

export const registerUserSuccess = createAction(REGISTER_USER_SUCCESS, props<{ registerPayload?: any }>());

export const registerUserFailed = createAction(REGISTER_USER_FAILED, props<{ error?: any }>());

export const logout = createAction(LOG_OUT);

export const clearIsRegister = createAction(CLEAR_IS_REGISTER);

export const clearStateAuth = createAction(CLEAR_STATE_AUTH)


