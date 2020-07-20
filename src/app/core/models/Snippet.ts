export interface Snippet {
    
    pk_Snippet_ID: number,
    Snippet_Record_GUID: string,

    fk_Enterprise_ID: number,

    fk_Session_ID: number,
    fk_User_ID: number,

    Snippet_Reference_Tag: number,

    Snippet_Name: string,

    Snippet_Description: string,
    Snippet_Text: string,

    Snippet_Category: string,
    Snippet_Type: string,

    Snippet_Colour_Name: string,
    Snippet_Colour_HEX: string,

    Snippet_Language: string,

    Snippet_DateOfCreation: Date,
    Snippet_DateOfLastUpdate: Date,
    Snippet_Deleted: number,

    Snippet_Status: number,
    Snippet_AccessLevel: number
}