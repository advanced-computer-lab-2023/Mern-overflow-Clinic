import admin from '../models/Adminstrator.js';
import appointment from '../models/appointment.js';
import doctor from '../models/Doctor.js';
import pack from '../models/Package.js';
import patient from '../models/Patient.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import app from "../index.js"
import { relative } from 'path';



export default{

    addPatient(req:Request, res:Response){
        const newPatient = patient.create(req.body)
        .then(
            (newPatient) =>{
                res.status(200).json(newPatient);
            }
            )
        .catch(
            (err) => {
                console.log(err);
                res.status(400).json(err);
            }
            )
    }
    ,
    createDoctor(req:Request, res:Response){
        req.body.status = "pending";
        const newDoctor = doctor.create(req.body)
        .then(
            (newDoctor) => {
                res.status(200).json(newDoctor);
            }
            )
        .catch(
            (err) =>{
                console.log("error");
                res.status(400).json(err);
            } 
            )
    }
    ,
    addAdmin(req:Request, res:Response){
        //handle later-AUTH
        //const userName = req.params.userName;
        
        //admin.find(userName)
        req.body.username = "admin";
        req.body.passwordHash = "admin";
        const newAdmin = admin.create()
        .then(
            (newAdmin) => {
                res.status(200).json(newAdmin);
            }
            )
        .catch(
            (err) =>{
                console.log("error");
                res.status(400).json(err);
            } 
            )
    }
    ,
    removeDoctor(req:Request, res:Response){
        const id = req.body.id;
        const doc = doctor.findByIdAndDelete({_id: id})
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
    
    }
    ,
    removePatient(req:Request, res:Response){
        const id = req.body.id;
        const pat = patient.findByIdAndDelete({_id: id})
        .then((pat) => {
            res.status(200).json(pat);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
    }
    ,
    removeAdmin(req:Request, res:Response){
        const id = req.body.id;
        const newAdmin = admin.findByIdAndDelete({_id: id})
        .then((newAdmin) => {
            res.status(200).json(newAdmin);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
    }
    ,
    viewDoctors(req:Request, res:Response){
        const doctors =  doctor.find({})
        .then(doctors => res.status(200).json(doctors))
        .catch((err) => {
            res.status(400).json(err);
        })
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
        const id = req.body.id;
        const pkg = pack.findByIdAndDelete({_id: id})
        .then((pkg) => {
            res.status(200).json(pkg);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
    }
    ,
    updateDoctor(req:Request, res:Response){

    }
    ,
    async addRelative(req:Request, res:Response){
        const relativeP = {
            name: req.body.name,
            mobileNumber: req.body.mobileNumber
        };
       
        const id = req.params.id;    
        
        try {
            const pat = await (patient.findById(id));
          
            if (!pat) {
              return res.status(404).json({ message: 'Patient not found' });
            }
          
            const newRelatives = pat.emergencyContact;
            newRelatives.push(relativeP);
            
            
          
            pat.emergencyContact=newRelatives;
            await pat.save();
             
            res.json(pat);
          } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
          }

        
           
        
        

    }
    ,
    viewRelatives(req:Request, res:Response){
        const id = req.params.id;
    
        const relatives = patient.findById(id)
       .then((relatives) => {
        if(relatives!==null)
            res.status(200).json(relatives.emergencyContact)
    })
       
    .catch(
        (err) =>{
            console.log(err);
            res.status(400).json(err);
        } 
        )
     }
    ,

    viewPatients(req:Request, res:Response){
        const pat =  patient.find({})
        .then(pat => res.status(200).json(pat))
        .catch((err) => {
            res.status(400).json(err);
        })
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


