import express from "express";
import bodyParser from "body-parser";
import doctorController from "../controllers/DoctorController.js";
import patientController from "../controllers/PatientController.js";
import prescriptionController from "../controllers/PrescriptionController.js";
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import healthRecordController from "../controllers/HealthRecordController.js";
import appointmentController from "../controllers/AppointmentController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname );
    }
  });
  const upload = multer({ storage: storage });

router.use(express.json());


// TODO: Put authentication
router.get("/", doctorController.listDoctors);
router.get("/:id/slots", isAuthenticated, doctorController.listSlots);
router.get("/:id/completedAppointments", isAuthenticated, doctorController.listCompletedPatients);
router.get("/:id", isAuthenticated, doctorController.readDoctor);
router.get("/:id/wallet", isAuthenticated, doctorController.viewWallet);
router.get("/:id/slots", isAuthenticated, doctorController.listSlots);
router.get("/:id/patients", doctorController.listDoctorPatients);
router.get( "/:id/registeredPatients", isAuthenticated, doctorController.listMyPatients);
router.get( "/:id/patients/:pId", isAuthenticated, doctorController.selectPatient);
router.get( "/:id/search", isAuthenticated, doctorController.selectPatientByName);
router.get( "/:id/res", isAuthenticated, doctorController.listAllMyPatientsUpcoming);
router.get("/pendingDoctors", isAuthenticated, isAuthorized([UserType.ADMINSTARTOR]), doctorController.listPendingDoctors);
router.get("/:dId/prescriptions", isAuthenticated, prescriptionController.viewDoctorPrescription);
router.get("/chatWithPatients/:id/:search",isAuthenticated,isAuthorized([UserType.DOCTOR]),doctorController.chatWithPatients);
router.get("/getAllMyPatients/:id",isAuthenticated,isAuthorized([UserType.DOCTOR]),doctorController.getAllMyPatients);

router.post("/filter", isAuthenticated, patientController.filterDoctor);
// router.post("/createMedicine", doctorController.createMedicine);
// router.post("/:id/patients/:pId/addPrescription", isAuthenticated, doctorController.createPrescription);
router.post( "/:id/addHealthRecord", isAuthenticated, healthRecordController.createHealthRecord);
router.post( "/:id/createFollowup", isAuthenticated, appointmentController.createFollowUp);
router.post("/filter", isAuthenticated, patientController.filterDoctor);
router.post("/", upload.array('files',10) ,doctorController.createDoctor);



router.put("/:id/acceptContract", isAuthenticated, doctorController.acceptContract);
router.put("/:id/rejectContract", isAuthenticated, doctorController.rejectContract);
router.put("/:id/addSlots", isAuthenticated, doctorController.addFreeSlots);
router.put("/:id", isAuthenticated, doctorController.updateDoctor);
router.put("/:id/acceptContract", isAuthenticated, doctorController.acceptContract);
router.put("/:id", isAuthenticated, doctorController.updateDoctor);
router.put("/:id/rejectContract", isAuthenticated, doctorController.rejectContract);
// router.put("/:id/addSlots", isAuthenticated, doctorController.addFreeSlots);
router.put("/:id/acceptFollowUp", isAuthenticated, doctorController.acceptFollowUp);
router.put("/:id/rejectFollowUp", isAuthenticated, doctorController.rejectFollowUp);
router.put("/:id/cancelAppointment", isAuthenticated, doctorController.cancelPatientAppointment);

//router.delete("/:id", isAuthenticated, doctorController.deleteDoctor);


export default router;
