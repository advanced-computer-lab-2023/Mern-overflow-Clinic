

import mongoose, {Schema, model} from "mongoose";


interface IDoctor {
    username:string;
    name: string;
    email: string;
    passwordHash: string;
    dateOfBirth: Date;
    hourlyRate: number;
    affiliation: string;
    education: string;
    status: string;
}

const doctorShema = new Schema<IDoctor>({
    username: { type: String, required: true , unique: true },
    name: { type: String, required: true , trim: true },
    email: { type: String, required: true, match : [/\S+@\S+\.\S+/, "invalid email"], },
    passwordHash:{ type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    affiliation: { type: String, required: true , trim: true },
    education: { type: String, required: true , trim: true },
    status: { type: String, required: true , lowercase: true, enum: ['pending', 'accepted', 'rejected'] },
})

const Doctor = model<IDoctor>('Doctor', doctorShema);




export default mongoose.model<IDoctor>("Doctor", doctorShema);



