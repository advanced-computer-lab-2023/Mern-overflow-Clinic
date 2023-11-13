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


//  const storage = multer.diskStorage({
//      destination: function (req, file, cb) {
//        cb(null, './src/uploads/'); // Specify the upload folder
//      },
//      filename: function (req, file, cb) {
//        cb(null, file.originalname); // Use the original file name
//     },
//    });
//  const upload = multer({ storage: storage });

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


// const storage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) => {
//     cb(null, "./src/uploads/"); // Specify the destination folder for storing files
//   },
//   filename: (req: Request, file: Express.Multer.File, cb: (error: null | Error, filename: string) => void) => {
//     const uniqueSuffix = Date.now();
//     cb(null, `${uniqueSuffix}${file.originalname}`);
//   },
// });

//GET
router.get(
  "/doctorsSearch",
  isAuthenticated,
  patientController.selectDoctorByNameAndSpeciality,
);
router.get("/:id/family", patientController.listFamilyMembers);
router.get("/:id/wallet", isAuthenticated, patientController.viewWallet);
//added this new route
router.post(
  "/:id/prescriptionsFilter",
  isAuthenticated,
  prescriptionController.filterPrescriptions,
);
//
router.get("/doctors/:dId", isAuthenticated, patientController.selectDoctor);
router.get("/:id/relatives", isAuthenticated, patientController.readFamilyMember);
router.get("/:id/documents", patientController.readDocuments);
router.get("/", isAuthenticated, patientController.listPatients);
router.get("/:id", isAuthenticated, patientController.readPatient);
router.get("/:id/prescriptions", isAuthenticated, prescriptionController.viewPatientPrescription);
router.get("/:id/price", isAuthenticated, patientController.listDoctorsBySessionPrice);
router.get("/:id/packages", patientController.listPatientPackages);
router.get("/:id/document", patientController.readPath);

//POST
router.post("/", patientController.createPatient);
router.post("/:id/familyMember", isAuthenticated, patientController.addFamilyMember);
router.post("/:id/documents", upload.single('file'), patientController.addDocument);
router.post("/:id/packages/:packageId", patientController.addPackage);
router.post("/:id/packages/:pId/:packageId", patientController.addPackageToFamMem);
router.post("/:id/linkfamilyMember", isAuthenticated, patientController.linkfamilyMember);

//DELETE
router.delete("/:id", isAuthenticated, patientController.deletePatient);
router.delete("/:id/documents", patientController.deleteDocument);
router.delete("/:id/packages", patientController.deletePackage);
router.delete("/:id/packages/:pId", patientController.deletePackageFromFamMem);


export default router;
