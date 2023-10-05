import mongoose, { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';
import { IPatient } from "./Patient.ts";
import { IDoctor } from "./Doctor.ts";
dotenv.config();
const mongoUrl: string = process.env.MONGO_URI!;

export interface IPrescription {
    patient: IPatient;
    doctor: IDoctor;
    medication: string[];
    date: Date;
}

// 2. Create a Schema corresponding to the document interface.
const PrescriptionSchema = new Schema<IPrescription>({
    patient: { type: mongoose.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    medication: [{ type: String, required: true }],
    date: { type: Date, required: true },
});

// 3. Create a Model.
const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);


export default mongoose.model<IPrescription>("Prescription", PrescriptionSchema);