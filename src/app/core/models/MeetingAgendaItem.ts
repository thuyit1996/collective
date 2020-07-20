export interface MeetingAgendaItem {
    pk_MeetingAgendaItem_ID: number,
    MeetingAgendaItem_Record_GUID: number,

    fk_Enterprise_ID: number,

    fk_Session_ID: number,
    fk_User_ID: number,

    fk_Meeting_ID: number,

    ActionItem_Name: string,
    ActionItem_Content: string,
    ActionItem_DateOfSubmission: Date,
    ActionItem_DateOfCompletion: Date,
    ActionItem_Parent: number,

    ActionItem_DateOfCreation: Date,
    ActionItem_DateOfLastUpdate: Date,
    ActionItem_Deleted: number,

    ActionItem_Status: number,
    ActionItem_AccessLevel: number

    AgendaItem_Name: string,
    AgendaItem_Content: string,
    fk_AgendaItem_Creator: number,

    AgendaItem_DateOfSubmission: Date,
    AgendaItem_DateOfCompletion: Date,

    AgendaItem_DateOfCreation: Date,
    AgendaItem_DateOfLastUpdate: Date,
    AgendaItem_Deleted: number,

    AgendaItem_Status: number,
    AgendaItem_AccessLevel: number
}