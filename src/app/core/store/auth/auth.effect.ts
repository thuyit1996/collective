import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as authActions from './auth.actions';
import { map, catchError, tap, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '../../models/Auth';
import { localStorageService } from '../../../configs/localStorage';
import { Register } from '../../models/Register';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { clearStateModule } from '../module/module.actions';
import { ClearStateMeeting } from '../meeting/meeting.actions';
import { clearStateProject } from '../project/project.actions';
import { ClearStateMeetingTranscript } from '../transcriber-meeting/meeting-transcript.actions';
import { clearStateUser } from '../user/users.action';
@Injectable()
export class AuthEffects {
  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.loginUser),
    exhaustMap((action) => {
      return this.authService.onLogin(action.userPayload as Auth).pipe(
        map(user => authActions.loginUserSuccess({ user: user })),
        catchError(error => of(authActions.loginUserFailed({ error })))
      )
    }),
  ))

  loginUserSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.loginUserSuccess),
      tap((action) => {
        let accessToken = action?.user?.access_token;
        if (accessToken) {
          localStorageService.setLocalStorageByKey('token', accessToken)
          localStorageService.setLocalStorageByKey('user-name', action?.user?.userName);
          this.router.navigate(['/main']);
        }
      })
    ),
    { dispatch: false }
  );

  loginUserFail$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.loginUserFailed),
      tap(() => {
        this.alertService.errorAlert('Email or password is invalid !');
      })
    ),
    { dispatch: false }
  );


  registerUser$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.registerUser),
    exhaustMap((action) => {
      return this.authService.onRegister(action.registerPayload as Register).pipe(
        map(_ => {
          return authActions.registerUserSuccess({ registerPayload: action.registerPayload });
        }),
        catchError(error => of(authActions.registerUserFailed({ error })))
      )
    })))


  registerUserSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.registerUserSuccess),
      tap((action) => {
        let loginDto = {
          Auth_Email: action?.registerPayload?.Email || '',
          Auth_Password: action?.registerPayload?.Password || '',
        }
        this.alertService.successAlert('Register user succcess !');
        this.store.dispatch(authActions.loginUser({
          userPayload: loginDto
        }))
      })
    ),
    { dispatch: false }
  );

  registerUserFail$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.registerUserFailed),
      tap((action) => {
        this.alertService.errorAlert(action.error?.error?.ModelState?.['']?.[1] || 'Register user failed !');
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(authActions.logout),
      tap(() => {
        this.store.dispatch(authActions.clearStateAuth());
        this.store.dispatch(clearStateUser());
        this.store.dispatch(clearStateModule());
        this.store.dispatch(ClearStateMeeting());
        this.store.dispatch(clearStateProject());
        this.store.dispatch(ClearStateMeetingTranscript());
        localStorageService.removeLocalStorageByKey('token');
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );
  constructor(
    private router: Router,
    private actions$: Actions,
    private alertService: AlertService,
    private authService: AuthService,
    private store: Store<AppState>
  ) { }
}

