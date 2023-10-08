import { Request, Response } from 'express';
import { HydratedDocument, } from 'mongoose';
// import Patient, { IPatient } from '../models/Patient.js'; // Import your Patient model
import User, {IUser} from '../models/User.js';
import TokenUtils from '../utils/Token.js';

const login = async (req: Request, res: Response) => {
    const { username, passwordHash } = req.body;

    try {
        const user: HydratedDocument<IUser> | null = await User.findOne({ username, passwordHash });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = await TokenUtils.generateToken(user);
        res.header('Authorization', `Bearer ${token}`);

        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    login,
}