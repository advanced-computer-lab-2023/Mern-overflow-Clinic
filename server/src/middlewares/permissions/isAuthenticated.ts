import { Request, Response, NextFunction } from 'express';
import TokenUtils from '../../utils/Token.js';
import doctor, { IDoctor } from "../../models/Doctor.js";
import { HydratedDocument } from 'mongoose';

// Define the type for your payload, which should match what you used in generating tokens.
interface TokenPayload {
    patientId: string; // Adjust the payload structure if needed.
}

// Extend the Request interface to include the patientId property.
declare global {
    namespace Express {
        interface Request {
            patientId?: string;
        }
    }
}

const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get the token from the request header or wherever you're sending it.
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        // If no token is provided, return an error response.
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    if (!TokenUtils.verifyToken(token)) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token signature' });
    }

    const decodedToken = TokenUtils.decodeToken(token);

    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    } else if(decodedToken.userRole === "2") {
        const doc: HydratedDocument<IDoctor> | null = await getDoctor(decodedToken.userId);
        if (!doc || doc.status != "accepted") {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    }



    next();
};

const getDoctor = async (id: string): Promise<HydratedDocument<IDoctor> | null> => {
    const doc: HydratedDocument<IDoctor> | null = await doctor.findById(id).exec();
    return doc;
}

export default isAuthenticated;
