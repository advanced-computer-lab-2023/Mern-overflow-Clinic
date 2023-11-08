import express from "express";
import bodyParser from "body-parser";
import patientController from "../controllers/PatientController.js";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get(
  "/doctorsSearch",
  isAuthenticated,
  patientController.selectDoctorByNameAndSpeciality,
);

//added this new route
router.post(
  "/:id/prescriptionsFilter",
  isAuthenticated,
  prescriptionController.filterPrescriptions,
);
//
router.get("/doctors/:dId", isAuthenticated, patientController.selectDoctor);
router.get(
  "/:id/relatives",
  isAuthenticated,
  patientController.readFamilyMember,
);
router.get("/", isAuthenticated, patientController.listPatients);
router.get("/:id", isAuthenticated, patientController.readPatient);
router.get(
  "/:id/prescriptions",
  isAuthenticated,
  prescriptionController.viewPatientPrescription,
);
router.get(
  "/:id/price",
  isAuthenticated,
  patientController.listDoctorsBySessionPrice,
);

//POST
router.post("/", isAuthenticated, patientController.createPatient);
router.post(
  "/:id/familyMember",
  isAuthenticated,
  patientController.addFamilyMember,
);

//DELETE
router.delete("/:id", isAuthenticated, patientController.deletePatient);

export default router;
