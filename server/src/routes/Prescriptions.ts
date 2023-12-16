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
router.post("/:id/addMedicineToCart", prescriptionController.addMedicineToCart);


//PUT
// router.put("/:id", prescriptionController.updatePrescription);
router.put("/:id/update/:mid", prescriptionController.updatePrescriptionMedicine);
// router.put("/:id",isAuthenticated, prescriptionController.updatePrescription);
// router.put("/:id/updateDosage/:mid",isAuthenticated, prescriptionController.updateDosage);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);
router.delete("/:id/deleteMedicine/:mid",isAuthenticated, prescriptionController.deleteMedicine);


export default router;
