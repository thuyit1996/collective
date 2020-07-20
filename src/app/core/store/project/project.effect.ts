import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as projectActions from './project.actions';
import { ProjectService } from '../../services/project.service';

@Injectable()
export class ProjectEffects {

  getProjects$ = createEffect(() => this.actions$.pipe(
    ofType(projectActions.getProjects),
    switchMap(() => {
      return this.projectService.getAllProjects().pipe(
        map(items => projectActions.getProjectsSuccess({ items })),
        catchError(error => of(projectActions.getProjectsFailed({ error: 'Get project list failed' })))
      );
    }),
  ));
  constructor(
    private actions$: Actions,
    private projectService: ProjectService,
  ) { }
}
