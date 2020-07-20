interface Project_User {
    fk_User_ID: number;
    User_FirstName: string;
    User_SecondName: string;
    User_Colour: string;
    User_Initials: string;
}
export interface Project {
    pk_Project_ID?: number;
    Project_Record_GUID?: string;
    fk_Enterprise_ID?: number;
    fk_Session_ID?: number;
    fk_User_ID?: number;
    fk_User_ID_ProjectOwner?: number;
    Project_Name?: string;
    Project_Description?: string;
    Project_StartDate?: string;
    Project_DueDate?: string;
    Project_DateOfCreation?: string;
    Project_DateOfLastUpdate?: string;
    Project_Deleted?: number;
    Project_Status?: number;
    Project_AccessLevel?: number;
    ProjectUsers: Project_User[];
}