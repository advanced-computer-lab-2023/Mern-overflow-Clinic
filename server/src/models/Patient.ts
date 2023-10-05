import mongoose, { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoUrl: string = process.env.MONGO_URI!;

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

export interface IPatient {
    username: string;
    name: string;
    email: string;
    passwordHash: string;
    dateOfBirth: Date;
    gender: string;
    mobileNumber: string;
    emergencyContact: emergencyContact[];
    familyMembers?: familyMember[];
    package?: typeof mongoose.Types.ObjectId;
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
            nationalId: { type: String, required: true},//TODO add validation
            age: { type: Number, required: true, min: 0, max: 122 },
            gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
            relation: { type: String, required: true, lowercase: true, },
        }
    ]
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

export default mongoose.model<IPatient>("User", PatientSchema);
