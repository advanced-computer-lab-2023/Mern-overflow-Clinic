import mongoose, { Schema,Types, model } from "mongoose";

export interface IHealthRecord {
    doctor?: Types.ObjectId;
    patient: Types.ObjectId;
    diagnosis: string;
    date?: Date;
}


const healthRecordSchema = new Schema<IHealthRecord>({
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: false },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    diagnosis: { type: String, required: true},
    date: { type: Date, required: false },
})

const healthRecord = model<IHealthRecord>('healthRecord', healthRecordSchema);


export default mongoose.model<IHealthRecord>('healthRecord', healthRecordSchema);

