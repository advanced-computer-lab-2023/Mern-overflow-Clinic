import { Request, Response } from 'express';
import { Document, } from 'mongoose';
import Patient, { IPatient } from '../models/Patient.js'; // Import your Patient model
import TokenUtils from '../utils/Token.js';

const login = async (req: Request, res: Response) => {
    const { username, passwordHash } = req.body;

    try {
        const patient: Document<IPatient> | null = await Patient.findOne({ username, passwordHash });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        const token = await TokenUtils.generateToken(patient);
        res.header('Authorization', `Bearer ${token}`);
        console.log(token);
        res.status(200).json({ token, patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    login,
}