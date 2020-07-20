import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import * as userActions from './users.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class UsersEffect {
  getMeetings$ = createEffect(() => this.actions$.pipe(
    ofType(userActions.getUsers),
    switchMap(() => {
      return this.userService.getAllUser().pipe(
        map(users => userActions.getUsersSuccess({ users: users })),
        catchError(error => of(userActions.getUsersFailed({ error })))
      )
    })
  ));
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) { }
}