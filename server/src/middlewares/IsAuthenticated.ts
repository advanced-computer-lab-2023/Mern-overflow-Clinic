import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';

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

// Define a middleware function.
const isAuthenticated = (
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

  const secretKey = config.jwt.secret;
  try {
    const decoded = jwt.verify(token, secretKey) as TokenPayload;

    req.patientId = decoded.patientId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

export default isAuthenticated;
