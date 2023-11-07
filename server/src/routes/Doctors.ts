import express from "express";
import bodyParser from "body-parser";
import doctorController from "../controllers/DoctorController.js";
import patientController from "../controllers/PatientController.js";
import healthRecordController from "../controllers/HealthRecordController.js";

const router = express.Router();
router.use(bodyParser.json());

router.get("/", doctorController.listDoctors);
router.post("/filter", patientController.filterDoctor);
router.get("/:id", doctorController.readDoctor);
router.get("/:id/wallet", doctorController.viewWallet);
router.put("/:id/acceptContract", doctorController.acceptContract);
router.put("/:id/rejectContract", doctorController.rejectContract);
router.put("/:id/addSlots", doctorController.addFreeSlots);
router.get("/:id/patients", doctorController.listDoctorPatients);
router.get("/:id/registeredPatients", doctorController.listMyPatients);
router.get("/:id/patients/:pId", doctorController.selectPatient);
router.get("/:id/search", doctorController.selectPatientByName);
router.get("/:id/res", doctorController.listAllMyPatientsUpcoming);
router.post("/:id/addHealthRecord",healthRecordController.createHealthRecord)
router.post("/", doctorController.createDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);


export default router;
