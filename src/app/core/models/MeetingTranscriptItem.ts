export interface MeetingTranscriptItem {
  pk_MeetingTranscriptItem_ID?: number,
  MeetingTranscriptItem_Record_GUID?: string,
  fk_Enterprise_ID?: number,
  fk_Session_ID?: number,
  fk_User_ID?: number,
  fk_Meeting_ID?: number,
  MeetingTranscriptItem_Note?: string,
  MeetingTranscriptItem_Timestamp?: string,
  MeetingTransscriptItem_DateOfCreation?: string,
  MeetingTransscriptItem_DateOfLastUpdate?: string,
  MeetingTransscriptItem_Deleted?: number,
  MeetingTransscriptItem_Status?: number,
  MeetingTransscriptItem_AccessLevel?: number,
  isRightPosition?: boolean,
  itemCanDelete?: boolean,
  randomId?: string,
}