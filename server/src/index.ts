import express from "express";
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import patientController from './controllers/UserController.js'
import doctorController from './controllers/DoctorController.js'
import adminstratorController from './controllers/AdminstratorController.js'
import packageController from './controllers/PackageController.js'
import exp from "constants";
import { Request, Response } from 'express';
import config from './config/config.js';
import AdminstratorController from "./controllers/AdminstratorController.js";
import admin from './models/Adminstrator.js';
import appointment from './models/appointment.js';
import doctor from './models/Doctor.js';
import pack from './models/Package.js';
import user from './models/Patient.js';
import config from './config/config.js';

mongoose.set('strictQuery', false);

//App variables
const MongoURI:string = config.mongo.URL;
const app = express();
const port:number = config.server.port;


app.use(bodyParser.json());


//GET 
app.get('/', (req,res)=>{
  res.send("hello");
  console.log("hello, world!");
});
app.get("/doctors",doctorController.listDoctors);
// app.get("/Relatives/:id",userController.viewRelatives);
app.get("/patients",patientController.listPatients);
// app.get("/PatientRecord",userController.viewRecordOfPatients);
app.get("/patient/:id",patientController.readPatient);
app.get("/doctor/:id",doctorController.readDoctor);
// app.get("/DoctorDetails",patientController.viewDoctorDetails);
// app.get("/PatientPrescriptions",patientController.viewPatientPrescription);
// app.get("/SearchPrescriptions",patientController.searchPrescriptions)

//POST
app.post("/patient", patientController.createPatient);
app.post("/doctor",doctorController.createDoctor);
app.post("/admin",AdminstratorController.createAdminstrator);
// app.post("/AcceptRequest",patientController.acceptAddDoctorRequest);
app.post("/package",packageController.createPackage);
// app.post("/AddRelative/:id",patientController.addRelative);

//PUT
app.put("/package/:id",packageController.updatePackage);
app.put("/doctor/:id",doctorController.updateDoctor);

//DELETE
app.delete("/doctor",doctorController.deleteDoctor);
app.delete("/Pptient",patientController.deletePatient);
app.delete("/admin",adminstratorController.deleteAdmin);
// app.delete("/RejectRequest",patientController.rejectAddDoctorRequest);
app.delete("/package",packageController.deletePackage);







mongoose.connect(MongoURI).then(()=>{
	console.log("MongoDB is now connected!")
// Starting server
  	app.listen(port, () => {
    	console.log(`Listening to requests on http://localhost:${port}`);
  	});
}).catch(err => console.log(err));


export default app;