import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id",isAuthenticated, prescriptionController.selectPrescription);
router.get("/medicineDetails/:mId",isAuthenticated, prescriptionController.listMedicine);
router.get("/:id/medicineDosage/:mid",isAuthenticated, prescriptionController.listMedDosage);


//POST
router.post("/doctors/:dId/patients/:pId/addPrescription",isAuthenticated, prescriptionController.createPrescription);
router.post("/:id/addMedicine",isAuthenticated, prescriptionController.addMedicine);


//PUT
router.put("/:id",isAuthenticated, prescriptionController.updatePrescription);
router.put("/:id/updateDosage/:mid",isAuthenticated, prescriptionController.updateDosage);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);
router.delete("/:id/deleteMedicine/:mid",isAuthenticated, prescriptionController.deleteMedicine);


export default router;
