import * as UsersActions from './users.action';
import { UsersState } from './users.state';
import { createReducer, on, Action } from '@ngrx/store';
import { localStorageService } from 'src/app/configs/localStorage';
const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: '',
  userProfile: null,
};

const reducer = createReducer(
  initialState,
  on(UsersActions.getUsers, (state) => {
    return { ...state, status: 'loading' }
  }),
  on(UsersActions.getUsersSuccess, (state, action) => {
    return { ...state, status: 'idle', users: action.users || [] }
  }),
  on(UsersActions.getUsersFailed, (state, action) => {
    return { ...state, status: 'error', error: action?.error || '' }
  }),
  on(UsersActions.getUserProfile, (state) => {
    return { ...state, userProfile: findUserProfile(state.users) }
  }),
  on(UsersActions.clearStateUser, () => {
    return { ...initialState }
  })
)
export function usersReducer(
  state: UsersState | undefined, action: Action
) {
  return reducer(state, action)
}

function findUserProfile(listUser) {
  let userEmail = localStorageService.getByKey('user-name');
  return listUser.find(item => item.User_Email === userEmail) ?? {};
}