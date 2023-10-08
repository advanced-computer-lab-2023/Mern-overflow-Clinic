import jwt from 'jsonwebtoken';
import {IUser} from '../models/User.js';
import { Document, } from 'mongoose';
import config from '../config/config.js';

const generateToken= async(user: Document<IUser>) => {
    const secretKey = config.jwt.secret;
    const expiresIn = '7d';
    console.log("here");
    const token = jwt.sign(
      {
        patientId: user._id,
      },
      secretKey,
      { expiresIn }
    );
  
    return token;
  };


export default {
    generateToken
}


