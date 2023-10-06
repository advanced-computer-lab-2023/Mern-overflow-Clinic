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
        // const newPatient = new patient(
        // {
        //     username: req.body.username,
        //     name: req.body.name,
        //     email: req.body.email,
        //     passwordHash: req.body.passwordHash,
        //     dateOfBirth: req.body.dateOfBirth,
        //     gender: req.body.gender,
        //     mobileNumber: req.body.mobileNumber,
        //     emergencyContact: req.body.emergencyContact
        // }
        // )
        // newPatient.save().then((result)=>{
        //     res.send(result);
        // }).catch((err)=>{
        //     console.log(err);
        // });
        const newPatient = patient.create(req.body)
        .then(
            (newPatient) =>{
                res.status(200).json(newPatient);
            }
            )
        .catch(
            (err) => {
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


