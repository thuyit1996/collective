import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModuleState } from './module.state';

export const selectModuleState = createFeatureSelector<ModuleState>('feature_module');
export const selectModule = createSelector(selectModuleState, state => state.moduleName);
export const selectIsCreateItem = createSelector(selectModuleState, state => state.isCreateItem);