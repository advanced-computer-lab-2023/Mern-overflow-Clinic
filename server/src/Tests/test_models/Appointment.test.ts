import { Types } from 'mongoose';
import Appointment from '../../models/appointment.ts';

describe('appointment model', () => {
    it('should throw an error if doctor is missing', async () => {
        const appointmentWithoutDoctor = {
            patient: new Types.ObjectId(),
            date: new Date(),
            duration: 60,
            status: 'upcoming',
            price: 100,
            appointmentType: 'regular',
        };

        const appointment = new Appointment(appointmentWithoutDoctor);
        await expect(appointment.save()).rejects.toThrow('Appointment validation failed: doctor: Path `doctor` is required.');
    });

    it('should throw an error if patient is missing', async () => {
        const appointmentWithoutPatient = {
            doctor: new Types.ObjectId(),
            date: new Date(),
            duration: 60,
            status: 'upcoming',
            price: 100,
            appointmentType: 'regular',
        };

        const appointment = new Appointment(appointmentWithoutPatient);
        await expect(appointment.save()).rejects.toThrow('Appointment validation failed: patient: Path `patient` is required.');
    });

    it('should throw an error if date is missing', async () => {
        const appointmentWithoutDate = {
            doctor: new Types.ObjectId(),
            patient: new Types.ObjectId(),
            duration: 60,
            status: 'upcoming',
            price: 100,
            appointmentType: 'regular',
        };

        const appointment = new Appointment(appointmentWithoutDate);
        await expect(appointment.save()).rejects.toThrow('Appointment validation failed: date: Path `date` is required.');
    });

    it('should throw an error if duration is missing', async () => {
        const appointmentWithoutDuration = {
            doctor: new Types.ObjectId(),
            patient: new Types.ObjectId(),
            date: new Date(),
            status: 'upcoming',
            price: 100,
            appointmentType: 'regular',
        };

        const appointment = new Appointment(appointmentWithoutDuration);
        await expect(appointment.save()).rejects.toThrow('Appointment validation failed: duration: Path `duration` is required.');
    });

    it('should throw an error if status is missing', async () => {
        const appointmentWithoutStatus = {
            doctor: new Types.ObjectId(),
            patient: new Types.ObjectId(),
            date: new Date(),
            duration: 60,
            price: 100,
            appointmentType: 'regular',
        };

        const appointment = new Appointment(appointmentWithoutStatus);
        await expect(appointment.save()).rejects.toThrow('Appointment validation failed: status: Path `status` is required.');
    });
});
