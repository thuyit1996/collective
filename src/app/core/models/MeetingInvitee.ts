export interface MeetingInvitee {
pk_MeetingInvitee_ID: number,
MeetingInvitee_Record_GUID: string,

fk_Enterprise_ID: number,

fk_Session_ID: number,
fk_User_ID: number,

fk_Meeting_ID: number,

MeetingInvitee_DateOfInvite: Date,
MeetingInvitee_AttendanceStatus: number,
MeetingInvitee_ResponseNote: string,
MeetingInvitee_DateOfResponse: Date,

MeetingInvitee_DateOfCreation: Date,
MeetingInvitee_DateOfLastUpdate: Date,
MeetingInvitee_Deleted: number,

MeetingInvitee_Status: number,
MeetingInvitee_AccessLevel: number
}