import { createAction, props, ActionType } from '@ngrx/store';

export const SET_MODULE = '@Module/SetModule';
export const IS_CREATE_ITEM = '@Module/IsCreateItem';
export const CLEAR_STATE_MODULE = 'Module/ClearStateModule';

export const setModule = createAction(SET_MODULE, props<{ moduleName: any }>());
export const setIsCreateItem = createAction(IS_CREATE_ITEM);
export const clearStateModule = createAction(CLEAR_STATE_MODULE);