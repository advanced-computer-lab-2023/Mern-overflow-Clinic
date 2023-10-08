import jwt from 'jsonwebtoken';
import {IPatient} from '../models/Patient.js';
import { Document, } from 'mongoose';
import config from '../config/config.js';

const generateToken= async(patient: Document<IPatient>) => {
    const secretKey = config.jwt.secret;
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


