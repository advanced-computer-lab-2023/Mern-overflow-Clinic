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
import isAuthenticated from "./middlewares/IsAuthenticated.js";

mongoose.set("strictQuery", false);

//App variables
const MongoURI: string =
  config.mongo.URL;
const app = express();
const port: number = config.server.port;

app.use(bodyParser.json());

app.use('/auth', authRouter);

//GET
app.get("/", (req, res) => {
  res.send("hello");
  console.log("hello, world!");
});
app.get("/doctors", doctorController.listDoctors); 
app.get("/patients/:id/relatives", patientController.readFamilyMember);
app.get("/patients", patientController.listPatients);
// app.get("/PatientRecord",userController.viewRecordOfPatients);
app.get("/patients/:id", patientController.readPatient);
app.get("/doctors/:id", doctorController.readDoctor);
app.get("/doctors/:id/patients", doctorController.listAllMyPatients);
app.get("/doctors/:id/patients/:pId", doctorController.selectPatient);
app.get("/doctors/:id/search", doctorController.selectPatientByName);
app.get("/admins", adminstratorController.viewRequest);
app.get("/appointemnts",appointmentController.listAllAppointments);
app.get("/appointemnts/:id",appointmentController.readAppointment);
// app.get("/DoctorDetails",patientController.viewDoctorDetails);
app.get("/patient/:id/prescriptions",prescriptionController.viewPatientPrescription);
app.get("/prescriptions/:id",prescriptionController.selectPrescription);
// app.get("/SearchPrescriptions",patientController.searchPrescriptions)
app.get("/patients/:id/doctors/:dId", patientController.selectDoctor);
app.get("/patients/:id/doctors", patientController.selectDoctorByName);
app.get("/patients/:id/price", patientController.listDoctorsBySessionPrice);
app.get("/doctors/:id/res",doctorController.listAllMyPatientsUpcoming);
app.get("/packages/:id",packageController.readPackage);
app.get("/packages",packageController.listPackages);




//POST
app.post("/patients", patientController.createPatient);
app.post("/appointemnts", appointmentController.createAppointment);
app.post("/doctors", doctorController.createDoctor);
app.post("/admins", adminstratorController.createAdminstrator);
// app.post("/AcceptRequest",patientController.acceptAddDoctorRequest);
app.post("/packages", packageController.createPackage);
app.post("/prescriptions",prescriptionController.createPrescription);
// app.post("/patients/:id/relatives",patientController.addFamilyMember);
app.post("/packages",packageController.createPackage);


//PUT
app.put("/packages/:id", packageController.updatePackage);
app.put("/doctors/:id", doctorController.updateDoctor);
app.put("/prescriptions/:id",prescriptionController.updatePrescription);
app.put("/packages/:id",packageController.updatePackage);


//DELETE
app.delete("/doctors/:id", doctorController.deleteDoctor);
app.delete("/patients/:id", patientController.deletePatient);
app.delete("/admins/:id", adminstratorController.deleteAdmin);
app.delete("/prescriptions/:id",prescriptionController.deletePrescription);
// app.delete("/RejectRequest",patientController.rejectAddDoctorRequest);
app.delete("/packages/:id", packageController.deletePackage);
app.delete("/appointments/:id",appointmentController.deleteAppointment);
app.delete("/packages/:id",packageController.deletePackage);


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
