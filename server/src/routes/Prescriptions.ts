import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id", isAuthenticated, prescriptionController.selectPrescription);

//POST
router.post("/doctors/:dId/patients/:pId/addPrescription", isAuthenticated, prescriptionController.createPrescription);

//PUT
router.put("/:id", isAuthenticated, prescriptionController.updatePrescription);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);

export default router;
