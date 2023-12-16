import { Types } from 'mongoose';
import Patient from '../../models/Patient.ts';

describe('patient model', () => {
    test('should throw an error if name is missing', async () => {
        const patientWithoutName = {
            wallet: 4,
            email: "email@gmail.com",
            passwordHash: "password",
            username: "username",
            nationalId: '123456789',
            dateOfBirth: new Date(),
            gender: 'male',
            mobileNumber: '+12345678',
            emergencyContact: {
                name: 'EmergencyContact',
                mobileNumber: '+12345678',
                relation: 'parent',
            },
        };

        const patient = new Patient(patientWithoutName);
        await expect(patient.save()).rejects.toThrow('Patient validation failed: name: Path `name` is required.');
    });

    test('should throw an error if nationalId is missing', async () => {
        const patientWithoutNationalId = {
            wallet: 0,
            email: "email@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'John Doe',
            dateOfBirth: new Date(),
            gender: 'male',
            mobileNumber: '+12345678',
            emergencyContact: {
                name: 'EmergencyContact',
                mobileNumber: '+12345678',
                relation: 'parent',
            },
        };

        const patient = new Patient(patientWithoutNationalId);
        await expect(patient.save()).rejects.toThrow('Patient validation failed: nationalId: Path `nationalId` is required.');
    });

    test('should throw an error if dateOfBirth is missing', async () => {
        const patientWithoutDateOfBirth = {
            wallet: 0,
            email: "email@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'John Doe',
            nationalId: '123456789',
            gender: 'male',
            mobileNumber: '+12345678',
            emergencyContact: {
                name: 'EmergencyContact',
                mobileNumber: '+12345678',
                relation: 'parent',
            },
        };

        const patient = new Patient(patientWithoutDateOfBirth);
        await expect(patient.save()).rejects.toThrow('Patient validation failed: dateOfBirth: Path `dateOfBirth` is required.');
    });

    test('should throw an error if gender is missing', async () => {
        const patientWithoutGender = {
            wallet: 0,
            email: "email@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'John Doe',
            nationalId: '123456789',
            dateOfBirth: new Date(),
            mobileNumber: '+12345678',
            emergencyContact: {
                name: 'EmergencyContact',
                mobileNumber: '+12345678',
                relation: 'parent',
            },
        };

        const patient = new Patient(patientWithoutGender);
        await expect(patient.save()).rejects.toThrow('Patient validation failed: gender: Path `gender` is required.');
    });

    test('should throw an error if mobileNumber is missing', async () => {
        const patientWithoutMobileNumber = {
            wallet: 0,
            email: "email@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'John Doe',
            nationalId: '123456789',
            dateOfBirth: new Date(),
            gender: 'male',
            emergencyContact: {
                name: 'EmergencyContact',
                mobileNumber: '+12345678',
                relation: 'parent',
            },
        };

        const patient = new Patient(patientWithoutMobileNumber);
        await expect(patient.save()).rejects.toThrow('Patient validation failed: mobileNumber: Path `mobileNumber` is required.');
    });
});
