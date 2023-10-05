import express from "express";
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userController from './controller/userController.ts'
import exp from "constants";
import { Request, Response } from 'express';

dotenv.config()
mongoose.set('strictQuery', false);

//App variables
const MongoURI:string = "mongodb+srv://dbuser:987654321@acl.n4q8ykx.mongodb.net/?retryWrites=true&w=majority"!;
const app = express();
const port:number = parseInt(process.env.PORT!) as number || 8000;

//app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
// app.use(express.json);


//GET 
app.get('/', (req,res)=>{
  res.send("hello");
  console.log("hello, world!");
});
app.get("/Doctors",userController.viewDoctors);
app.get("/Relatives",userController.viewRelatives);
app.get("/Patients",userController.viewPatients);
app.get("/PatientRecord",userController.viewRecordOfPatients);
app.get("/SearchPatient",userController.searchPatient);
app.get("/SearchDoctor",userController.searchDoctor);
app.get("/DoctorDetails",userController.viewDoctorDetails);
app.get("/PatientPrescriptions",userController.viewPatientPrescription);
app.get("/SearchPrescriptions",userController.searchPrescriptions)

//POST
app.post("/AddRequest",userController.addRequest);
app.post("/AddAdmin",userController.addAdmin);
app.post("/AcceptRequest",userController.acceptAddDoctorRequest);
app.post("/AddPackage",userController.addPackage);
app.post("/AddRelative",userController.addRelative);


//PUT
app.put("/UpdatePackage",userController.updatePackage);

//PATCH
app.patch("/UpdateDoctorData",userController.updateDoctor);

//DELETE
app.delete("/RemoveDoctor",userController.removeDoctor);
app.delete("/RemovePatient",userController.removePatient);
app.delete("/RemoveAdmin",userController.removeAdmin);
app.delete("/RejectRequest",userController.rejectAddDoctorRequest);
app.delete("/DeletePackage",userController.deletePackage);





mongoose.connect(MongoURI).then(()=>{
	console.log("MongoDB is now connected!")
// Starting server
  	app.listen(port, () => {
    	console.log(`Listening to requests on http://localhost:${port}`);
  	});
}).catch(err => console.log(err));


export default app;