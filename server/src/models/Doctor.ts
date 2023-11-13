import mongoose, { Schema, model } from "mongoose";
import User from "./User.js";

export interface IDoctor {
    // username:string;
    name: string;
    email: string;
    // passwordHash: string;
    dateOfBirth: Date;
    //gender:string;
    hourlyRate: number;
    affiliation: string;
    education: string;
    files: document[];
    status: string;
    speciality: string;
    wallet: number;
    availableSlotsStartTime?: Date[];
}

interface document {
    filename: string;
    path: string;
}

const doctorShema = new Schema<IDoctor>({
    // username: { type: String, required: true , unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, match: [/\S+@\S+\.\S+/, "invalid email"], },
    // passwordHash:{ type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    //gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
    hourlyRate: { type: Number, required: true },
    affiliation: { type: String, required: true, trim: true },
    speciality: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    files: [
        {
            filename: { type: String, required: true, trim: true },
            path: { type: String, required:true, trim: true },
        }
    ],
    status: { type: String, required: true, lowercase: true, enum: ['pending', 'accepted', 'rejected'] },
    wallet:{ type: Number, required: true , default: 0.0},
    availableSlotsStartTime: { type: [Date], required: false, default: [] },
})
doctorShema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.name = this.name.toLowerCase();
    }
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }
    if (this.isModified('speciality')) {
        this.speciality = this.speciality.toLowerCase();
    }

    next();
});
// const Doctor = model<IDoctor>('Doctor', doctorShema);
const Doctor = User.discriminator<IDoctor>('Doctor', doctorShema);

// export default mongoose.model<IDoctor>("Doctor", doctorShema);
export default Doctor;



