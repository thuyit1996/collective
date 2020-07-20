
export interface Enterprise {
    pk_Enterprise_ID: number,
    Enterprise_Record_GUID: string,

    fk_Enterprise_ID: number,
    fk_Session_ID: number,
    fk_User_ID: number,

    fk_User_ID_MainContact: number,

    Enterprise_RefernceCode: string,
    Enterprise_Name: string,
    Enterprise_Name2: string,
    Enterprise_CompanyNumber: string,
    Enterprise_BussinessNumber: string,
    Enterprise_TaxRegistrationNumber: string,
    Enterprise_DUNs: string,

    Enterprise_StreetAddress: string,
    Enterprise_StreetAddress2: string,
    Enterprise_StreetAddress3: string,
    Enterprise_City: string,
    Enterprise_Region: string,
    Enterprise_Postcode: string,
    Enterprise_Country: string,
    Enterprise_CountryCoded: string,

    Enterprise_PhoneNumberCountryCode: string,
    Enterprise_PhoneNumberAreaCode: string,
    Enterprise_PhoneNumber: string,
    Enterprise_PhoneNumberExtention: string,

    Enterprise_AlternateNumberCountryCode: string,
    Enterprise_AlternateNumberAreaCode: string,
    Enterprise_AlternateNumber: string,
    Enterprise_AlternateNumberExtention: string,

    Enterprise_Email: string,
    Enterprise_Notes: string,

    Enterprise_DateOfCreation: Date,
    Enterprise_DateOfLastUpdate: Date,
    Enterprise_Deleted: number,

    Enterprise_Status: number,
    Enterprise_AccessLevel: number
}