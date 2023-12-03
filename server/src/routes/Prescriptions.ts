import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id", isAuthenticated, prescriptionController.selectPrescription);

//POST
router.post("/doctors/:dId/patients/:pId/addPrescription", prescriptionController.createPrescription);
router.post("/:id/addMedicine", prescriptionController.addMedicine);


//PUT
router.put("/:id", prescriptionController.updatePrescription);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);
router.delete("/:id/deleteMedicine", prescriptionController.deleteMedicine);


export default router;
