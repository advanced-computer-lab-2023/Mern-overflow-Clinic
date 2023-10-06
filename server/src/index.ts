import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import bodyParser from "body-parser";
import patientController from "./controllers/PatientController.js";
import doctorController from "./controllers/DoctorController.js";
import adminstratorController from "./controllers/AdminstratorController.js";
import packageController from "./controllers/PackageController.js";
// import exp from "constants";
// import { Request, Response } from 'express';
import config from "./config/config.js";

mongoose.set("strictQuery", false);

//App variables
const MongoURI: string =
  config.mongo.URL ||
  "mongodb+srv://dbuser:987654321@acl.n4q8ykx.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port: number = config.server.port || 8000;

app.use(bodyParser.json());

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
app.get("/admins", adminstratorController.viewRequest);
// app.get("/DoctorDetails",patientController.viewDoctorDetails);
// app.get("/PatientPrescriptions",patientController.viewPatientPrescription);
// app.get("/SearchPrescriptions",patientController.searchPrescriptions)

//POST
app.post("/patients", patientController.createPatient);
app.post("/doctors", doctorController.createDoctor);
app.post("/admins", adminstratorController.createAdminstrator);
// app.post("/AcceptRequest",patientController.acceptAddDoctorRequest);
app.post("/packages", packageController.createPackage);
// app.post("/patients/:id/relatives",patientController.addFamilyMember);

//PUT
app.put("/packages/:id", packageController.updatePackage);
app.put("/doctors/:id", doctorController.updateDoctor);

//DELETE
app.delete("/doctors", doctorController.deleteDoctor);
app.delete("/patients", patientController.deletePatient);
app.delete("/admins", adminstratorController.deleteAdmin);
// app.delete("/RejectRequest",patientController.rejectAddDoctorRequest);
app.delete("/packages", packageController.deletePackage);

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
