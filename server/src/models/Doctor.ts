import mongoose, {Schema, model} from "mongoose";
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
    status: string;
    speciality: string;

}

const doctorShema = new Schema<IDoctor>({
    // username: { type: String, required: true , unique: true },
    name: { type: String, required: true , trim: true },
    email: { type: String, required: true, match : [/\S+@\S+\.\S+/, "invalid email"], },
    // passwordHash:{ type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    //gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
    hourlyRate: { type: Number, required: true },
    affiliation: { type: String, required: true , trim: true },
    education: { type: String, required: true , trim: true },
    status: { type: String, required: true , lowercase: true, enum: ['pending', 'accepted', 'rejected'] },
    speciality: { type: String, required: true , trim: true },
})
doctorShema.pre('save', function (next) {
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



