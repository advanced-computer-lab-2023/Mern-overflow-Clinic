import express from "express";
import bodyParser from "body-parser";
import doctorController from "../controllers/DoctorController.js";
import patientController from "../controllers/PatientController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

router.get("/", isAuthenticated, doctorController.listDoctors);
router.post("/filter", isAuthenticated, patientController.filterDoctor);
router.get("/:id", isAuthenticated, doctorController.readDoctor);
router.get(
  "/:id/patients",
  isAuthenticated,
  doctorController.listDoctorPatients,
);
router.get(
  "/:id/registeredPatients",
  isAuthenticated,
  doctorController.listMyPatients,
);
router.get(
  "/:id/patients/:pId",
  isAuthenticated,
  doctorController.selectPatient,
);
router.get(
  "/:id/search",
  isAuthenticated,
  doctorController.selectPatientByName,
);
router.get(
  "/:id/res",
  isAuthenticated,
  doctorController.listAllMyPatientsUpcoming,
);
router.post("/", isAuthenticated, doctorController.createDoctor);
router.put("/:id", isAuthenticated, doctorController.updateDoctor);
router.delete("/:id", isAuthenticated, doctorController.deleteDoctor);

export default router;
