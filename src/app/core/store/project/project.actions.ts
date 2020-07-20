import { createAction, props } from '@ngrx/store';
import { Project } from '../../models/Project';

export const GET_PROJECTS = '@Project/GetAll';
export const GET_PROJECTS_SUCCESS = '@Project/GetProjectsSuccess';
export const GET_PROJECTS_FAILED = '@Project/GetProjectsFailed';
export const SELECT_PROJECT = '@Project/SelectProject';
export const CLEAR_STATE_PROJECT = '@Project/ClearStateProject';

export const getProjects = createAction(GET_PROJECTS);
export const getProjectsSuccess = createAction(GET_PROJECTS_SUCCESS, props<{ items: Project[] }>());
export const getProjectsFailed = createAction(GET_PROJECTS_FAILED, props<{ error?: string }>());
export const selectProject = createAction(SELECT_PROJECT, props<{ projectId: number }>());
export const clearStateProject = createAction(CLEAR_STATE_PROJECT);
