import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import bodyParser from "body-parser";
import patientController from "./controllers/PatientController.js";
import doctorController from "./controllers/DoctorController.js";
import adminstratorController from "./controllers/AdminstratorController.js";
import packageController from "./controllers/PackageController.js";
import Prescription from "./models/Prescription.js";
import appointmentController from "./controllers/AppointmentController.js";
// import exp from "constants";
// import { Request, Response } from 'express';
import config from "./config/config.js";
import prescriptionController from "./controllers/PrescriptionController.js"

import authRouter from './routes/Auth.js';
import doctorRouter from './routes/Doctors.js';
import isAuthenticated from "./middlewares/permissions/isAuthenticated.js";
import isAuthorized from "./middlewares/permissions/isAuthorized.js";
import { UserType } from "./enums/UserTypes.js";
mongoose.set("strictQuery", false);

//App variables
const MongoURI: string =config.mongo.URL;
const app = express();
const port: number = config.server.port;
app.use(bodyParser.json());



//ROUTERS
app.use('/auth', authRouter);
app.use('/doctors', doctorRouter);

//GET
app.get("/", (req, res) => {
    res.send("hello");
    console.log("hello, world!");
});
app.get("/patients/:id/relatives", patientController.readFamilyMember);
app.get("/patients", patientController.listPatients);
// app.get("/PatientRecord",userController.viewRecordOfPatients);
app.get("/patients/:id", patientController.readPatient);
// app.get("/admins", adminstratorController.viewRequest);
app.get("/admins" ,isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]), adminstratorController.listAdminstrators)
app.get("/appointemnts", appointmentController.listAllAppointments);
app.get("/appointemnts/:id", appointmentController.readAppointment);
// app.get("/DoctorDetails",patientController.viewDoctorDetails);
app.get("/patient/:id/prescriptions", prescriptionController.viewPatientPrescription);
app.get("/prescriptions/:id", prescriptionController.selectPrescription);
// app.get("/SearchPrescriptions",patientController.searchPrescriptions)
app.get("/patients/:id/doctors/:dId", patientController.selectDoctor);
app.get("/patients/:id/doctors", patientController.selectDoctorByName);
app.get("/patients/:id/price", patientController.listDoctorsBySessionPrice);
app.get("/packages/:id", packageController.readPackage);
app.get("/packages", packageController.listPackages);
app.get("/doctors/filter", patientController.filterDoctor);




//POST
app.post("/patients", patientController.createPatient);
app.post("/appointments", appointmentController.createAppointment);
app.post("/admins", adminstratorController.createAdminstrator);
// app.post("/AcceptRequest",patientController.acceptAddDoctorRequest);
app.post("/packages", packageController.createPackage);
app.post("/prescriptions", prescriptionController.createPrescription);
// app.post("/patients/:id/relatives",patientController.addFamilyMember);
app.post("/packages",packageController.createPackage);
//app.post("/doctors",doctorController.createDoctor);

//PUT
app.put("/packages/:id", packageController.updatePackage);
app.put("/prescriptions/:id", prescriptionController.updatePrescription);
app.put("/packages/:id", packageController.updatePackage);


//DELETE
app.delete("/patients/:id", patientController.deletePatient);
app.delete("/admins/:id", adminstratorController.deleteAdmin);
app.delete("/prescriptions/:id", prescriptionController.deletePrescription);
// app.delete("/RejectRequest",patientController.rejectAddDoctorRequest);
app.delete("/packages/:id", packageController.deletePackage);
app.delete("/appointments/:id", appointmentController.deleteAppointment);
app.delete("/packages/:id", packageController.deletePackage);


mongoose
    .connect(MongoURI)
    .then(() => {
        console.log("MongoDB is now connected!");
        // Starting server
        app.listen(port, () => {
            console.log(`Listening to requests on http://localhost:${port}`);
        });
    })
    .catch((err) => console.log(err));

export default app;
