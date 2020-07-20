import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from './project.state';

export const featureProject = createFeatureSelector<ProjectState>('feature_project');
export const projectSelector = createSelector(featureProject, state => state.items);
export const projectStatusSelector = createSelector(featureProject, state => state.status);
export const projectCurrentItemSelector = createSelector(featureProject, state => state.currentItem);
