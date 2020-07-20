import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as meetingTranscriptActions from './meeting-transcript.actions';
import { TranscriberMeetingService } from '../../services/transcriber-meeting.service';

@Injectable()
export class MeetingTransriptEffects {

  getMeetingTranscriber$ = createEffect(() => this.actions$.pipe(
    ofType(meetingTranscriptActions.getMeetingTranscript),
    switchMap(() => {
      return this.transcriberMeetingService.getAllTransriberMeeting().pipe(
        map(items => meetingTranscriptActions.GetMeetingTransriptSuccess({ items })),
        catchError(error => of(meetingTranscriptActions.GetMeetingTransriptFailed({ error: 'Get meeting transcript failed' })))
      );
    }),
  ));
  constructor(
    private actions$: Actions,
    private transcriberMeetingService: TranscriberMeetingService,
  ) { }
}
