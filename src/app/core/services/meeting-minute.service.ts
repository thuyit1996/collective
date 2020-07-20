import { Injectable } from "@angular/core";
import { CallApiService } from '../../shared/services/call-api.service';
import { TRANSCRIBER_MEETING_END_POINT, MEETING_MINUTE_END_POINT } from '../../configs/url';

@Injectable({
  providedIn: 'root'
})

export class MeetingMinuteService {
  constructor(private apiService: CallApiService) {
  }

  getAllTransriberMeeting() {
    return this.apiService.callApiGet(TRANSCRIBER_MEETING_END_POINT);
  }

  addMeetingMinute(body) {
    return this.apiService.callApiPost(MEETING_MINUTE_END_POINT, body);
  }
}