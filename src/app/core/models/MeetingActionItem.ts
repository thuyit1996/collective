export interface MeetingActionItem {
        pk_MeetingActionItem_ID: number,
        MeetingActionItem_Record_GUID: number,

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
}