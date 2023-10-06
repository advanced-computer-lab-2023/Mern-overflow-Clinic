import admin from '../models/Adminstrator.js';
import appointment from '../models/appointment.js';
import doctor from '../models/Doctor.js';
import pack from '../models/Package.js';
import patient from '../models/Patient.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import app from "../index.js"

export default{

     addPatient(req:Request, res:Response){
        
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
            //console.log(err);
        });
    }
    ,
    addRequest(req:Request, res:Response){

    }
    ,
    addAdmin(req:Request, res:Response){

    }
    ,
    removeDoctor(req:Request, res:Response){

    }
    ,
    removePatient(req:Request, res:Response){

    }
    ,
    removeAdmin(req:Request, res:Response){

    }
    ,
    viewDoctors(req:Request, res:Response){

    }
    ,
    acceptAddDoctorRequest(req:Request, res:Response){
        //add doctor after accepting request
    }
    ,
    rejectAddDoctorRequest(req:Request, res:Response){
        //reject addition of new doctor to database
    }
    ,
    addPackage(req:Request, res:Response){

    }   
    ,
    updatePackage(req:Request, res:Response){

    }
    ,
    deletePackage(req:Request, res:Response){

    }
    ,
    updateDoctor(req:Request, res:Response){

    }
    ,
    addRelative(req:Request, res:Response){

    }
    ,
    viewRelatives(req:Request, res:Response){

    }
    ,
    viewPatients(req:Request, res:Response){

    }
    ,
    viewRecordOfPatients(req:Request, res:Response){

    }
    ,
    searchPatient(req:Request, res:Response){

    }
    ,
    searchDoctor(req:Request, res:Response){

    }
    ,
    viewDoctorDetails(req:Request, res:Response){

    }
    ,
    viewPatientPrescription(req:Request, res:Response){

    }
    ,
    searchPrescriptions(req:Request, res:Response){

    }
    
}


