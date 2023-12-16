import { Types } from 'mongoose';
import Doctor from '../../models/Doctor.ts';

describe('doctor model', () => {
    it('should throw an error if name is missing', async () => {
        const doctorWithoutName = {
            email: "valid@gmail.com",
            passwordHash: "password",
            username: "username",
            dateOfBirth: new Date(),
            hourlyRate: 100,
            affiliation: 'Medical Center',
            education: 'Medical Degree',
            files: [{ filename: 'file1.txt', path: '/path/to/file1.txt' }],
            status: 'pending',
            speciality: 'Cardiology',
            wallet: 0.0,
        };

        const doctor = new Doctor(doctorWithoutName);
        await expect(doctor.save()).rejects.toThrow('Doctor validation failed: name: Path `name` is required.');
    });

    it('should throw an error if dateOfBirth is missing', async () => {
        const doctorWithoutDateOfBirth = {
            email: "valid@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'Dr. John Doe',
            hourlyRate: 100,
            affiliation: 'Medical Center',
            education: 'Medical Degree',
            files: [{ filename: 'file1.txt', path: '/path/to/file1.txt' }],
            status: 'pending',
            speciality: 'Cardiology',
            wallet: 0.0,
        };

        const doctor = new Doctor(doctorWithoutDateOfBirth);
        await expect(doctor.save()).rejects.toThrow('Doctor validation failed: dateOfBirth: Path `dateOfBirth` is required.');
    });

    it('should throw an error if hourlyRate is missing', async () => {
        const doctorWithoutHourlyRate = {
            email: "valid@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'Dr. John Doe',
            dateOfBirth: new Date(),
            affiliation: 'Medical Center',
            education: 'Medical Degree',
            files: [{ filename: 'file1.txt', path: '/path/to/file1.txt' }],
            status: 'pending',
            speciality: 'Cardiology',
            wallet: 0.0,
        };

        const doctor = new Doctor(doctorWithoutHourlyRate);
        await expect(doctor.save()).rejects.toThrow('Doctor validation failed: hourlyRate: Path `hourlyRate` is required.');
    });

    it('should throw an error if affiliation is missing', async () => {
        const doctorWithoutAffiliation = {
            email: "valid@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'Dr. John Doe',
            dateOfBirth: new Date(),
            hourlyRate: 100,
            education: 'Medical Degree',
            files: [{ filename: 'file1.txt', path: '/path/to/file1.txt' }],
            status: 'pending',
            speciality: 'Cardiology',
            wallet: 0.0,
        };

        const doctor = new Doctor(doctorWithoutAffiliation);
        await expect(doctor.save()).rejects.toThrow('Doctor validation failed: affiliation: Path `affiliation` is required.');
    });

    it('should throw an error if speciality is missing', async () => {
        const doctorWithoutSpeciality = {
            email: "valid@gmail.com",
            passwordHash: "password",
            username: "username",
            name: 'Dr. John Doe',
            dateOfBirth: new Date(),
            hourlyRate: 100,
            affiliation: 'Medical Center',
            education: 'Medical Degree',
            files: [{ filename: 'file1.txt', path: '/path/to/file1.txt' }],
            status: 'pending',
            wallet: 0.0,
        };

        const doctor = new Doctor(doctorWithoutSpeciality);
        await expect(doctor.save()).rejects.toThrow('Doctor validation failed: speciality: Path `speciality` is required.');
    });
});
