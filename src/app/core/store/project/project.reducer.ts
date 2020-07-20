import { ProjectState } from './project.state';
import * as ProjectActions from './project.actions';
import { createReducer, on, Action } from '@ngrx/store';

const initialState: ProjectState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: '',
  sort: null,
};

const reducer = createReducer(
  initialState,
  on(ProjectActions.getProjects, (state, action) => {
    return { ...state, status: 'loading' }
  }),
  on(ProjectActions.getProjectsSuccess, (state, action) => {
    return { ...state, status: 'idle', error: '', items: action.items }
  }),
  on(ProjectActions.getProjectsFailed, (state, action) => {
    return { ...state, status: 'error', error: action.error || '', items: [] }
  }),
  on(ProjectActions.selectProject, (state, action) => {
    let projectsList = state.items;
    let currentItem = projectsList.find(item => item.pk_Project_ID === action.projectId);
    return { ...state, currentItem: currentItem || null }
  }),
  on(ProjectActions.clearStateProject, () => {
    return { ...initialState }
  })
)
export function projectReducer(
  state: ProjectState | undefined, action: Action
) {
  return reducer(state, action)
}