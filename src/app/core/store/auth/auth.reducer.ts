import { AuthState } from './auth.state';
import * as AuthActions from './auth.actions';
import { createReducer, on, Action } from '@ngrx/store';
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: '',
  isRegister: false,
  registerPayload: null,
}
const reducer = createReducer(
  initialState,
  on(AuthActions.loginUser, (state) => {
    return { ...state, status: 'loading' }
  }),
  on(AuthActions.loginUserSuccess, (state, action) => {
    return { ...state, user: action.user, status: 'idle', error: '' }
  }),
  on(AuthActions.loginUserFailed, (state, action) => {
    return { ...state, status: 'error', error: action.error || '' }
  }),
  on(AuthActions.registerUser, (state) => {
    return { ...state, status: 'loading' }
  }),
  on(AuthActions.registerUser, (state) => {
    return { ...state, status: 'loading' }
  }),
  on(AuthActions.registerUserSuccess, (state) => {
    return { ...state, status: 'idle', isRegister: true }
  }),
  on(AuthActions.registerUserFailed, (state) => {
    return { ...state, status: 'error' }
  }),
  on(AuthActions.clearIsRegister, (state) => {
    return { ...state, isRegister: false, }
  }),
  on(AuthActions.clearStateAuth, (state) => {
    return { ...initialState }
  }),
)

export function authReducer(
  state: AuthState | undefined, action: Action
) {
  return reducer(state, action)
}