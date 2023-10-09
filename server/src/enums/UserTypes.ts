export enum UserType {
    GUEST,
    PATIENT,
    DOCTOR,
    ADMINSTARTOR
}

export const UserTypesNames = new Map<String, UserType>([
    ["Guest", UserType.GUEST],
    ["Patient", UserType.PATIENT],
    ["Doctor", UserType.DOCTOR],
    ["Adminstrator", UserType.ADMINSTARTOR],
]);