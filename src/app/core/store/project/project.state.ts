import { Project } from '../../models/Project';

export interface ProjectState {
  items: Project[];
  currentItem: Project;
  status: 'idle' | 'loading' | 'error';
  error?: string;
  sort: 'asc' | 'desc' | null;
}