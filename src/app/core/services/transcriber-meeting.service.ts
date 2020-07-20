import { Injectable } from "@angular/core";
import { CallApiService } from '../../shared/services/call-api.service';
import { TRANSCRIBER_MEETING_END_POINT } from 'src/app/configs/url';

@Injectable({
  providedIn: 'root'
})

export class TranscriberMeetingService {
  constructor(
    private apiService: CallApiService,
  ) { }

  getAllTransriberMeeting() {
    return this.apiService.callApiGet(TRANSCRIBER_MEETING_END_POINT);
  }
  addTranscriberMeeting(body: any) {
    return this.apiService.callApiPost(TRANSCRIBER_MEETING_END_POINT, body);
  }

  updateTranscriberMeeting(body: any) {
    return this.apiService.callApiPut(TRANSCRIBER_MEETING_END_POINT, body);
  }
}