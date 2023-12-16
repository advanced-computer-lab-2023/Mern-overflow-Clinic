import mongoose, { NumberExpression, Schema, Types, model } from "mongoose";

interface IAppointment {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  prescription?: Types.ObjectId; //TODO prescription
  date: Date;
  duration: number;
  status: string;
  price: number;
  appointmentType?: string;
  paid?: boolean;
  followUpStatus?:string;
}

const appointmentSchema = new Schema<IAppointment>({
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  prescription: {
    type: Schema.Types.ObjectId,
    ref: "Prescription",
    required: false,
  },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["upcoming", "completed", "cancelled", "rescheduled"],
  },
  followUpStatus: { type: String, required: false, lowercase: true, enum: ['accepted', 'rejected','pending'], default: 'pending'},
  price: { type: Number, required: true },
  appointmentType: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["regular", "followup"],
  },
  paid: { type: Boolean, required: false }, // TO BE UPDATED
});

const Appointment = model<IAppointment>("Appointment", appointmentSchema);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
