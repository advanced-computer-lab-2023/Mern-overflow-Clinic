import express from "express";
import bodyParser from "body-parser";
import doctorController from "../controllers/DoctorController.js";
import patientController from "../controllers/PatientController.js";


const router = express.Router();
router.use(bodyParser.json());

router.get("/",doctorController.listDoctors);
router.get("/filter", patientController.filterDoctor);
router.get("/:id", doctorController.readDoctor);
router.get("/:id/patients", doctorController.listDoctorPatients);
router.get("/:id/patients/:pId", doctorController.selectPatient);
router.get("/:id/search", doctorController.selectPatientByName);
router.get("/:id/res", doctorController.listAllMyPatientsUpcoming);//?
router.post("/", doctorController.createDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);


export default router;