import express from "express";
import { Request, Express } from 'express';
import multer from 'multer';
import cors from 'cors';
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
  
  // const upload = multer({ storage: storage });




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
router.get("/:id/packages", patientController.listPatientPackages);
router.get("/:id/document", patientController.readPath);

//POST
router.post("/", patientController.createPatient);
router.post("/:id/familyMember", patientController.addFamilyMember);
router.post("/:id/documents", upload.single('file'), patientController.addDocument);
router.post("/:id/packages/:packageId", patientController.addPackage);
router.post("/:id/packages/:pId/:packageId", patientController.addPackageToFamMem);


//DELETE
router.delete("/:id", patientController.deletePatient);
router.delete("/:id/documents", patientController.deleteDocument);
router.delete("/:id/packages", patientController.deletePackage);
router.delete("/:id/packages/:pId", patientController.deletePackageFromFamMem);



export default router;
