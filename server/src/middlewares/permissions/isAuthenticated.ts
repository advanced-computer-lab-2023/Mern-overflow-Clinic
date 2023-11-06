import { Request, Response, NextFunction } from 'express';
import TokenUtils from '../../utils/Token.js';
import doctor, { IDoctor } from "../../models/Doctor.js";
import { HydratedDocument } from 'mongoose';
import { UserType, UserTypesNames } from '../../enums/UserTypes.js';
// import cookieParser from 'cookie-parser';

interface TokenPayload {
    userId: string;
    userRole: UserType;
}

declare global {
    namespace Express {
        interface Request {
            userId: string;
            userRole: UserType;
        }
    }
}

const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    if (!TokenUtils.verifyToken(token)) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token signature' });
    }

    const decodedToken = TokenUtils.decodeToken(token);

    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    } else if(decodedToken.userRole === UserType.DOCTOR) {
        getDoctor(decodedToken.userId)
            .then((doc) => {
                if (!doc || doc.status != "accepted") {
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    }
    next();
};

const getDoctor = async (id: string): Promise<HydratedDocument<IDoctor> | null> => {
    const doc: HydratedDocument<IDoctor> | null = await doctor.findById(id).exec();
    return doc;
}

export default isAuthenticated;
