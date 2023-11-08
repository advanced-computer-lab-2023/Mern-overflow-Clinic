

import mongoose, {Schema,Types, model} from "mongoose";


interface IAppointment {
    doctor: Types.ObjectId;
    patient: Types.ObjectId;
    prescription?: Types.ObjectId;//TODO prescription
    date: Date;
    duration: number;
    status:string;
    appointmentType?:string;
}

const appointmentSchema = new Schema<IAppointment>({
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    prescription: { type: Schema.Types.ObjectId, ref: "Prescription", required: false },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true, lowercase: true, enum: ['upcoming', 'completed','canceled','rescheduled']},
    appointmentType: { type: String, required: true, lowercase: true, enum: ['regular', 'followup']},
})

const Appointment = model<IAppointment>('Appointment', appointmentSchema);


export default mongoose.model<IAppointment>("Appointment", appointmentSchema);



