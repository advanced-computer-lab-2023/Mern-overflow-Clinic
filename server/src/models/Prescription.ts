import mongoose, { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoUrl: string = process.env.MONGO_URI!;

export interface IPrescription {
    patient: typeof mongoose.Types.ObjectId;
    doctor: typeof mongoose.Types.ObjectId;
    medicine: typeof mongoose.Types.ObjectId[];
    date: Date;
    filled: boolean;
}

// 2. Create a Schema corresponding to the document interface.
const PrescriptionSchema = new Schema<IPrescription>({
    patient: { type: mongoose.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    medicine: [{ type: mongoose.Types.ObjectId, required: false }],
    date: { type: Date, required: true },
    filled: { type: Boolean, required: true },
});

// 3. Create a Model.
const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);


export default mongoose.model<IPrescription>("Prescription", PrescriptionSchema);