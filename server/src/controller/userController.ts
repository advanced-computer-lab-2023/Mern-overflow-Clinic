import admin from '../models/Adminstrator.ts';
import appointment from '../models/appointment.ts';
import doctor from '../models/Doctor.ts';
import pack from '../models/Package.ts';
import patient from '../models/Patient.ts';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';



function addPatient(req:Request, res:Response){
    // const newPatient = patient.create(req.body)
    // .then(newPatient => res.json(newPatient))
    // .catch((err)=>res.json(err))

    const newPatient = new patient(
    {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        mobileNumber: req.body.mobileNumber,
        emergencyContact: req.body.emergencyContact
    }
    )
    newPatient.save().then((result)=>{
        res.send(result);
    }).catch((err)=>{
        console.log(err);
    });
}
export default addPatient;