import { ModuleState } from './module.state';
const initialState: ModuleState = {
  moduleName: 'meeting',
  isCreateItem: false,
}
import { Action, createReducer, on } from '@ngrx/store';
import { setModule, setIsCreateItem, clearStateModule } from './module.actions';
const reducer = createReducer(
  initialState,
  on(setModule, (state, action) => {
    return { ...state, moduleName: action.moduleName }
  }),
  on(setIsCreateItem, (state) => {
    return { ...state, isCreateItem: !state.isCreateItem }
  }),
  on(clearStateModule, () => {
    return { ...initialState }
  }),
);
export function moduleReducer(
  state: ModuleState | undefined, action: Action
) {
  return reducer(state, action)
}