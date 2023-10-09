import mongoose, { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';
import config from '.././config/config.js';
dotenv.config();
const mongoUrl: string = config.mongo.URL;

interface emergencyContact {
    name: string;
    mobileNumber: string;
}

interface familyMember {
    name: string;
    nationalId: string;
    age:number;
    gender:string;
    relation:string;
}

interface IPatient {
    username: string;
    name: string;
    email: string;
    passwordHash: string;
    dateOfBirth: Date;
    gender: string;
    mobileNumber: string;
    emergencyContact: emergencyContact[];
    familyMembers?: familyMember[];
    prescriptions?: typeof mongoose.Types.ObjectId[];
    package?: typeof mongoose.Types.ObjectId;
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
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, match: [/\S+@\S+\.\S+/, "invalid email"], },
    passwordHash: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
    mobileNumber: { type: String, required: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, "invalid charachters"] },
    emergencyContact: [
        {
            name: { type: String, required: true, trim: true },
            mobileNumber: { type: String, required: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, "invalid charachters"] },
        }
    ],
    familyMembers: [
        {
            name: { type: String, required: true, trim: true },
            nationalId: { type: mongoose.Types.ObjectId, ref: "NationalId", required: true, validate: { validator: validateNationalId, message: 'invalid national id' } },//TODO write test for this
            age: { type: Number, required: true, min: 0, max: 122 },
            gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
            relation: { type: String, required: true, lowercase: true, enum: ['husband', 'wife', 'son', 'daughter']},//TODO add validation for relation
        }
    ],
    prescriptions: [{ type: mongoose.Types.ObjectId, ref: "Prescription", required: false }],
    package: { type: mongoose.Types.ObjectId, ref: "Package", required: false },

});

// 3. Create a Model.
const Patient = model<IPatient>('Patient', PatientSchema);


// let p;
// export async function f():Promise<any> {
//     await connect(mongoUrl);
//     p = await User.deleteMany({name:'Ahmed'}).exec();
//     console.log(p);
// }






// run().catch(err => console.log(err));

export async function addTestPatient(username: string, name: string, email: string, passwordHash: string, date: string, gender: string, mobileNumber: string) {
    // 4. Connect to MongoDB
    await connect(mongoUrl);

    const patient = new Patient({
        username: username,
        name: name,
        email: email,
        passwordHash: passwordHash,
        dateOfBirth: new Date(date),
        gender: gender,
        mobileNumber: mobileNumber,
        emergencyContact: {
            name: 'person',
            mobileNumber: '01000000001'
        }
    });
    await patient.save();
    console.log('Document inserted:', patient);
}

export default mongoose.model<IPatient>("Patient", PatientSchema);
