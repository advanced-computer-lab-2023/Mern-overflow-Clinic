import mongoose, { Schema,Types, model } from "mongoose";

export interface IHealthRecord {
    doctor: Types.ObjectId;
    patient: Types.ObjectId;
    name: string;
    diagnosis: string;
    date: Date;
}


const healthRecordSchema = new Schema<IHealthRecord>({
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    name: { type: String, required: true},
    diagnosis: { type: String, required: true},
    date: { type: Date, required: true },
})

const healthRecord = model<IHealthRecord>('HealthRecords', healthRecordSchema);


export default mongoose.model<IHealthRecord>('HealthRecords', healthRecordSchema);

