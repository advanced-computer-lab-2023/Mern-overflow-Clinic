import mongoose, { Schema, Types,model, connect } from 'mongoose';
import User from "./User.js";
import HelthRecords, {IHealthRecord} from './HelthRecords.js';
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
    familyMembers?: familyMember[];
    prescriptions?: Types.ObjectId[];
    package?: Types.ObjectId;
    healthRecords?: IHealthRecord[];
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
    emergencyContact: [
        {
            name: { type: String, required: true, trim: true },
            mobileNumber: { type: String, required: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, "invalid charachters"] },
        }
    ],
    familyMembers: [
        {
            //name: { type: String, required: true, trim: true },
            nationalId: { type: String, required: true },//TODO add validation
            patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
            // age: { type: Number, required: true, min: 0, max: 122 },
            // gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
             relation: { type: String, required: true, lowercase: true, enum: ['wife', 'husband','child']},
            // package: { type: mongoose.Types.ObjectId, ref: "Package", required: false },
        }
    ],
    prescriptions: [{ type: Schema.Types.ObjectId, ref: "Prescription", required: false }],
    package: { type: Schema.Types.ObjectId, ref: "Package", required: false },
    healthRecords: [
        {
            name: { type: String, required: true,},
            diagnosis: { type: String, required: true },
            date: { type: Date, required: true },
        }
    ],
});

PatientSchema.pre('save', function (next) {
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
