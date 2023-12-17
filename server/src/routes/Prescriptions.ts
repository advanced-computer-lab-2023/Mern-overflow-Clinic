import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id",isAuthenticated, prescriptionController.readPrescription);
router.get("/medicineDetails/:mId",isAuthenticated, prescriptionController.listMedicine);
router.get("/:id/medicineDosageQuantity/:mid",isAuthenticated, prescriptionController.readPresMedDetails);


//POST
router.post("/doctors/:dId/patients/:pId/addPrescription",isAuthenticated, prescriptionController.createPrescription);
router.post("/:id/addMedicine",isAuthenticated, prescriptionController.addMedicine);
router.post("/:id/addMedicineToCart", isAuthenticated, prescriptionController.addMedicineToCart);


//PUT
router.put("/:id/update/:mid", isAuthenticated, prescriptionController.updatePrescriptionMedicine);
router.put("/:id/collect", prescriptionController.collectPrescription);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);
router.delete("/:id/deleteMedicine/:mid",isAuthenticated, prescriptionController.deleteMedicine);


export default router;
