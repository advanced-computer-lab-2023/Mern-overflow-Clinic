import express from "express";
import bodyParser from "body-parser";
import patientController from "../controllers/PatientController.js";
import prescriptionController from "../controllers/PrescriptionController.js";


const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/doctorsSearch", patientController.selectDoctorByNameAndSpeciality);
router.get("/doctors/:dId", patientController.selectDoctor);
router.get("/:id/relatives", patientController.readFamilyMember);
router.get("/", patientController.listPatients);
router.get("/:id", patientController.readPatient);
router.get("/:id/prescriptions", prescriptionController.viewPatientPrescription);

router.get("/:id/price", patientController.listDoctorsBySessionPrice);

//POST
router.post("/", patientController.createPatient);
router.post("/:id/familyMember",patientController.addFamilyMember);


//DELETE
router.delete("/:id", patientController.deletePatient);


export default router;