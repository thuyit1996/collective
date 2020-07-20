import { Injectable } from '@angular/core';
import { CallApiService } from '../../shared/services/call-api.service';
import { MEETINGS_API_END_POINT, USERS_OF_MEETING, USERS_API_END_POINT, MEETING_GET_BY_PROJECT_ID } from '../../configs/url';

@Injectable({
  providedIn: 'root'
})

export class MeetingService {
  constructor(private apiService: CallApiService,
  ) {
  }
  getAllMeetings() {
    return this.apiService.callApiGet(MEETINGS_API_END_POINT);
  }

  getMeetingById(id: number) {
    return this.apiService.callApiGet(MEETINGS_API_END_POINT + id);
  }

  addMeeting(meetingPayload: any) {
    return this.apiService.callApiPost(MEETINGS_API_END_POINT, JSON.stringify(meetingPayload));
  }

  updateMeeting(meetingData: any) {
    return this.apiService.callApiPut(MEETINGS_API_END_POINT, meetingData);
  }

  deleteMeetingById(meetingId: number) {
    return this.apiService.callApiDelete(MEETINGS_API_END_POINT + meetingId);
  }

  getUserOfMeeting(meetingId: number) {
    return this.apiService.callApiGet(USERS_OF_MEETING + meetingId);
  }

  getAllUser() {
    return this.apiService.callApiGet(USERS_API_END_POINT);
  }

  getMeetingByProjectId(projectId) {
    return this.apiService.callApiGet(MEETING_GET_BY_PROJECT_ID + projectId);
  }

}
