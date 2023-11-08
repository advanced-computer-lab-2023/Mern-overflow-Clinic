import mongoose, { Schema, Types, model, connect } from 'mongoose';
import User from "./User.js";
import HelthRecords, { IHealthRecord } from './HelthRecords.js';

interface emergencyContact {
    name: string;
    mobileNumber: string;
}

interface familyMember {
    //name: string;
    nationalId: string;
    patientId: Types.ObjectId;
    // age: number;
    // gender: string;
    relation: string;
    // package?: typeof mongoose.Types.ObjectId;
}

interface document {
    filename: string;
    path: string;
}


export interface IPatient {
    // username: string;
    name: string;
    email: string;
    nationalId: string;
    // passwordHash: string;
    dateOfBirth: Date;
    gender: string;
    mobileNumber: string;
    emergencyContact: emergencyContact[];
    files?: document[];
    familyMembers?: familyMember[];
    prescriptions?: Types.ObjectId[];
    package?: Types.ObjectId;
    healthRecords?: Types.ObjectId[];
    wallet: number;
}

/*
function validateNationalId(nationalId: string, dateOfBirth: Date, gender: string): boolean {
    // Check if the national ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(nationalId)) {
        return false;
    }

    // Check if the national ID is exactly 14 characters long
    if (nationalId.length !== 14) {
        return false;
    }

    // Check if the first digit corresponds to the century of dateOfBirth where 2 => 20th century
    const year = dateOfBirth.getFullYear();
    const centuryDigit = nationalId.charAt(0);
    if (parseInt(centuryDigit) !== Math.floor(year / 100) - 18) {
        return false;
    }
    
    // Check if the second and third digits correspond to the year of dateOfBirth
    const yearDigits = nationalId.substring(1, 3);
    if (parseInt(yearDigits) !== year % 100) {
        return false;
    }

    // Check if the fourth and fifth digits correspond to the month of dateOfBirth
    const month = dateOfBirth.getMonth() + 1;
    const monthDigits = nationalId.substring(3, 5);
    if (parseInt(monthDigits) !== month) {
        return false;
    }

    // Check if the sixth and seventh digits correspond to the day of dateOfBirth
    const day = dateOfBirth.getDate();
    const dayDigits = nationalId.substring(5, 7);
    if (parseInt(dayDigits) !== day) {
        return false;
    }

    // Check if the thirteenth digit corresponds to gender, where odd is male and even is female
    const genderDigit = parseInt(nationalId.charAt(12));
    if ((gender === 'male' && genderDigit % 2 === 0) || (gender === 'female' && genderDigit % 2 !== 0)) {
        return false;
    }
    
    return true;
}
*/

function validateNationalId (nationalId: string, age: number, gender: string): boolean {
    // Check if the national ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(nationalId)) {
        return false;
    }

    // Check if the national ID is exactly 14 characters long
    if (nationalId.length !== 14) {
        return false;
    }

    // Check if digits 2 through 6 correspond to the birth date
    const year = nationalId.substring(1, 3);
    const month = nationalId.substring(3, 5);
    const day = nationalId.substring(5, 7);
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const ageDiff = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (ageDiff < age || (ageDiff === age && monthDiff < 0) || (ageDiff === age && monthDiff === 0 && dayDiff < 0)) {
        return false;
    }

    // Check if the thirteenth digit corresponds to gender, where odd is male and even is female
    const genderDigit = parseInt(nationalId.charAt(12));
    if ((gender === 'male' && genderDigit % 2 === 0) || (gender === 'female' && genderDigit % 2 !== 0)) {
        return false;
    }

    return true;
}

// 2. Create a Schema corresponding to the document interface.
const PatientSchema = new Schema<IPatient>({
    // username: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, "invalid email"], },
    nationalId: { type: String, required: true },
    // passwordHash: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
    mobileNumber: { type: String, required: true, unique: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, "invalid charachters"] },
    wallet:{ type: Number, required: true , default: 0.0},
    emergencyContact: [
        {
            name: { type: String, required: true, trim: true },
            mobileNumber: { type: String, required: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, "invalid charachters"] },
        }
    ],
    files: [
        {
            filename: { type: String, required: true, trim: true, unique:true },
            path: { type: String, required:true, trim: true },
        }
    ],
    familyMembers: [
        {
            name: { type: String, required: true, trim: true },
            nationalId: { type: String, required: true },//TODO add validation
            patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
            age: { type: Number, required: true, min: 0, max: 122 },
            gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
            relation: { type: String, required: true, lowercase: true, enum: ['wife', 'husband', 'child'] },
            // package: { type: mongoose.Types.ObjectId, ref: "Package", required: false },
        }
    ],
    prescriptions: [{ type: Schema.Types.ObjectId, ref: "Prescription", required: false }],
    package: { type: Schema.Types.ObjectId, ref: "Package", required: false },
    healthRecords: [{ type: Schema.Types.ObjectId, ref: "HealthRecords", required: false }],
});

PatientSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.name = this.name.toLowerCase();
    }
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }

    next();
});

// 3. Create a Model.
// const Patient = model<IPatient>('Patient', PatientSchema);
const Patient = User.discriminator<IPatient>('Patient', PatientSchema);

// export default mongoose.model<IPatient>("Patient", PatientSchema);
export default Patient;
