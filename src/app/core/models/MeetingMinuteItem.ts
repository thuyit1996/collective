        
export interface MeetingMinuteItem {
        pk_MeetingMinuteItem_ID: number,
        MeetingMinute_Record_GUID: number,

        fk_Enterprise_ID: number,

        fk_Session_ID: number,
        fk_User_ID: number,

        fk_Meeting_ID: number,
        fk_MeetingTranscriptItem_ID: number,

        MeetingMinuteItem_DateOfAction: Date,
        MeetingMinuteItem_DateOfClosure: Date,

        fk_UserID_ClosedBy: number,

        MeetingMinuteItem_Name: Date,
        MeetingMinuteItem_Content: Date,
        MeetingMinuteItem_Notes: Date,

        MeetingMinuteItem_DateOfCreation: Date,
        MeetingMinuteItem_DateOfLastUpdate: Date,
        MeetingMinuteItem_Deleted: number,

        MeetingMinuteItem_Status: number,
        MeetingMinuteItem_AccessLevel: number
}