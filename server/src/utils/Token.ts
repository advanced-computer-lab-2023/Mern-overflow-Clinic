import jwt from 'jsonwebtoken';
import {IPatient} from '../models/Patient.js';
import { Document, } from 'mongoose';

const generateToken= async(patient: Document<IPatient>) => {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';//TODO
    const expiresIn = '1h';
    console.log("here");
    const token = jwt.sign(
      {
        patientId: patient._id,
      },
      secretKey,
      { expiresIn }
    );
  
    return token;
  };


export default {
    generateToken
}


