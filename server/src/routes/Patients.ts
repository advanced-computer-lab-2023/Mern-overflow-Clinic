import express from "express";
import { Request, Express } from 'express';
//import multer from 'multer';
import bodyParser from "body-parser";
import patientController from "../controllers/PatientController.js";
import prescriptionController from "../controllers/PrescriptionController.js";


// const storage = multer.diskStorage({
//     // destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//     //   cb(null, "uploads/"); // Create an 'uploads' folder
//     // },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       const uniqueSuffix = Date.now();
//       cb(null, uniqueSuffix + file.originalname);
//     },
//   });
  
//   const upload = multer({ storage: storage });

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/doctorsSearch", patientController.selectDoctorByNameAndSpeciality);
router.get("/:id/wallet", patientController.viewWallet);
//added this new route
router.post("/:id/prescriptionsFilter", prescriptionController.filterPrescriptions);
//
router.get("/doctors/:dId", patientController.selectDoctor);
router.get("/:id/relatives", patientController.readFamilyMember);
router.get("/:id/documents", patientController.readDocuments);
router.get("/", patientController.listPatients);
router.get("/:id", patientController.readPatient);
router.get("/:id/prescriptions", prescriptionController.viewPatientPrescription);
router.get("/:id/price", patientController.listDoctorsBySessionPrice);

//POST
router.post("/", patientController.createPatient);
router.post("/:id/familyMember", patientController.addFamilyMember);
router.post("/:id/documents", patientController.addDocument);


//DELETE
router.delete("/:id", patientController.deletePatient);


export default router;
