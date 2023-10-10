import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id", prescriptionController.selectPrescription);

//POST
router.post("/", prescriptionController.createPrescription);

//PUT
router.put("/:id", prescriptionController.updatePrescription);

//DELETE
router.delete("/:id", prescriptionController.deletePrescription);



export default router;
