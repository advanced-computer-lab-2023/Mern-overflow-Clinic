import mongoose, { Schema, Types, model } from 'mongoose';
import User from './User.js';
import HealthRecords, { IHealthRecord } from './HelthRecords.js';

interface emergencyContact {
  name: string;
  mobileNumber: string;
}

interface familyMember {
  name: string;
  nationalId: string;
  patientId: Types.ObjectId;
  gender: string;
  relation: string;
}

export interface IPatient {
  name: string;
  email: string;
  nationalId: string;
  dateOfBirth: Date;
  gender: string;
  mobileNumber: string;
  emergencyContact: emergencyContact[];
  familyMembers?: familyMember[];
  prescriptions?: Types.ObjectId[];
  package?: Types.ObjectId;
  healthRecords?: Types.ObjectId[]; // Updated to store only IDs
  wallet?: number;
}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'invalid email'] },
  nationalId: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
  mobileNumber: { type: String, required: true, unique: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, 'invalid charachters'] },
  emergencyContact: [
    {
      name: { type: String, required: true, trim: true },
      mobileNumber: { type: String, required: true, min: 8, max: 16, match: [/^(\+\d{8,15}|\d{8,15})$/, 'invalid charachters'] },
    },
  ],
  familyMembers: [
    {
      name: { type: String, required: true, trim: true },
      nationalId: { type: String, required: true },
      patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
      gender: { type: String, required: true, lowercase: true, enum: ['male', 'female'] },
      relation: { type: String, required: true, lowercase: true, enum: ['wife', 'husband', 'child'] },
    },
  ],
  prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription', required: false }],
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: false },
  healthRecords: [{ type: Schema.Types.ObjectId, ref: 'HealthRecord', required: false }], // Updated to store only IDs
  wallet: { type: Number, required: false },
});

PatientSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = this.name.toLowerCase();
  }
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }

  next();
});

const Patient = User.discriminator<IPatient>('Patient', PatientSchema);

export default Patient;
