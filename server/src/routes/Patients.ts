import express from "express";
import { Request, Express } from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from "body-parser";
import patientController from "../controllers/PatientController.js";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, "./src/uploads/"); // Create an 'uploads' folder
     },
     filename: (req, file, cb) => {
       //const uniqueSuffix = Date.now();
       cb(null, file.originalname);
     },
   });
   const upload = multer({ storage: storage });


//GET
router.get("/", isAuthenticated, patientController.listPatients);
router.get("/:id", isAuthenticated, patientController.readPatient);
router.get("/:id/family", isAuthenticated, patientController.listFamilyMembers);
router.get("/:id/relatives", isAuthenticated, patientController.readFamilyMember);
router.get("/doctors/:dId", isAuthenticated, patientController.selectDoctor);
router.get("/doctorsSearch", isAuthenticated, patientController.selectDoctorByNameAndSpeciality);
router.get("/:id/price", isAuthenticated, patientController.listDoctorsBySessionPrice);
router.get("/:id/prescriptions", isAuthenticated, prescriptionController.viewPatientPrescription);
router.get("/:id/packages", isAuthenticated, patientController.listPatientPackages);
// router.get("/:id/packages/:pId/discount", isAuthenticated, patientController.getPackageDiscount);
router.get("/:id/wallet", isAuthenticated, patientController.viewWallet);
router.get("/:id/documents", isAuthenticated, patientController.readDocuments);
router.get("/:id/document", isAuthenticated, patientController.readPath);
router.get("/:id/healthRecords", patientController.viewMyHealthRecords);

//POST
router.post("/", patientController.createPatient);
router.post("/:id/familyMember", isAuthenticated, patientController.addFamilyMember);
router.post("/:id/linkfamilyMember", isAuthenticated, patientController.linkfamilyMember);
router.post("/:id/documents", isAuthenticated, upload.single('file'), patientController.addDocument);
router.post("/:id/packages/:packageId", isAuthenticated, patientController.addPackage);
router.post("/:id/packages/:pId/:packageId", isAuthenticated, patientController.addPackageToFamMem);
router.post("/:id/prescriptionsFilter", isAuthenticated, prescriptionController.filterPrescriptions);

//DELETE
router.delete("/:id", isAuthenticated, patientController.deletePatient);
router.delete("/:id/documents", isAuthenticated, patientController.deleteDocument);
router.delete("/:id/packages", isAuthenticated, patientController.deletePackage);
router.delete("/:id/packages/:pId", isAuthenticated, patientController.deletePackageFromFamMem);


export default router;
