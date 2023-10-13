import mongoose, { Schema, model } from "mongoose";

export interface IHealthRecord {
    name: string;
    diagnosis: string;
    date: Date;
}


const healthRecordSchema = new Schema<IHealthRecord>({
    name: { type: String, required: true},
    diagnosis: { type: String, required: true},
    date: { type: Date, required: true },
})

const healthRecord = model<IHealthRecord>('healthRecord', healthRecordSchema);


export default mongoose.model<IHealthRecord>('healthRecord', healthRecordSchema);

