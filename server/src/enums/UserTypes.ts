export enum UserType {
    GUEST,
    PATIENT,
    DOCTOR,
    ADMINSTARTOR
}

export const UserTypesNames = new Map<String, UserType>([
    ["GUEST", UserType.GUEST],
    ["PATIENT", UserType.PATIENT],
    ["DOCTOR", UserType.DOCTOR],
    ["ADMINSTARTOR", UserType.ADMINSTARTOR],
]);