

import mongoose, {Schema, model} from "mongoose";


interface IAppointment {
    doctor:typeof mongoose.Types.ObjectId;
    patient:typeof mongoose.Types.ObjectId;
    prescription?: typeof mongoose.Types.ObjectId;//TODO prescription
    date: Date;
    duration: number;
}

const appointmentSchema = new Schema<IAppointment>({
    doctor: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Types.ObjectId, ref: "Patient", required: true },
    prescription: { type: mongoose.Types.ObjectId, ref: "Prescription", required: false },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
})

const Appointment = model<IAppointment>('Appointment', appointmentSchema);


export default mongoose.model<IAppointment>("Appointment", appointmentSchema);



