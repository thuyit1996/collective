import { MeetingTranscriptItem } from '../../../core/models/MeetingTranscriptItem';
import { localStorageService } from 'src/app/configs/localStorage';
declare var $;
export function meetingDto({
  selectedProjectID,
  MeetingAttendees,
  MeetingType
}) {
  return {
    Meeting_Name: new Date().getTime(),
    Meeting_ScheduledStartTime: new Date(),
    Meeting_ScheduledFinishTime: new Date(),
    Meeting_ScheduledDuration: new Date(),
    Meeting_RecurranceRangeDate: new Date(),
    fk_Project_ID: selectedProjectID,
    MeetingAttendees: MeetingAttendees || [],
    fk_Meeting_Type_ID: MeetingType,
    Meeting_Status: 1
  }
}

export function transcriberMeetingItemDto({
  fk_User_ID,
  fk_Meeting_ID,
  MeetingTranscriptItem_Note
}) {
  return {
    fk_User_ID,
    fk_Meeting_ID,
    MeetingTranscriptItem_Note
  }
}

export function findTranscriber(meetingList, meetingId) {
  return (meetingList.filter(item => item?.fk_Meeting_ID === meetingId) || []) as MeetingTranscriptItem[];
}

export function setPositionTranscriberMeeting(transcriberList, userId) {
  let newtranscriberList = [...transcriberList] as MeetingTranscriptItem[];;
  newtranscriberList = newtranscriberList.map(item => {
    return {
      ...item,
      isRightPosition: userId === item?.fk_User_ID
    }
  }) as MeetingTranscriptItem[];
  return newtranscriberList;
}


export function isAuthorized(usersList, userId) {
  let userEmail = localStorageService.getByKey('user-name');
  let findUser = (usersList || []).find(item => item?.pk_User_ID === userId);
  return findUser?.User_Email === userEmail;
}

export function scrollBottom() {
  let className = '.meeting-discussion .modal-body';
  setTimeout(() => {
    let offsetTop = (document.querySelector(className) as HTMLElement).scrollHeight;
    $(className).animate({
      scrollTop: offsetTop
    }, 400);
  }, 120);
}