import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as meetingActions from './meeting.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MeetingService } from '../../services/meeting.service';
import { of } from 'rxjs';
@Injectable()
export class MeetingEffects {
  getMeetings$ = createEffect(() => this.actions$.pipe(
    ofType(meetingActions.getMeetings),
    switchMap(() => {
      return this.meetingService.getAllMeetings().pipe(
        map(items => meetingActions.getMeetingsSuccess({ items })),
        catchError(error => of(meetingActions.getMeetingsFailed({ error: 'Get meeting list failed' })))
      );
    }),
  ));
  getMeetingAttendees$ = createEffect(() => this.actions$.pipe(
    ofType(meetingActions.getMeetingAttendees),
    switchMap((action) => {
      return this.meetingService.getUserOfMeeting(action.meetingId).pipe(
        map(users => meetingActions.getMeetingAttendeesSuccess({ users, meetingId: action.meetingId })),
        catchError(error => of(meetingActions.getMeetingAttendeesFailed({ error: 'Get meeting attendees failed' })))
      );
    }),
  ));

  constructor(
    private actions$: Actions,
    private meetingService: MeetingService,
  ) { }
}
