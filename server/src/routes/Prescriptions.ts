import express from "express";
import bodyParser from "body-parser";
import prescriptionController from "../controllers/PrescriptionController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id", prescriptionController.selectPrescription);
router.get("/medicineDetails/:mId", prescriptionController.listMedicine);
router.get("/:id/medicineDosage/:mid", prescriptionController.listMedDosage);


//POST
router.post("/doctors/:dId/patients/:pId/addPrescription", prescriptionController.createPrescription);
router.post("/:id/addMedicine", prescriptionController.addMedicine);
router.post("/:id/addMedicineToCart", prescriptionController.addMedicineToCart);


//PUT
// router.put("/:id", prescriptionController.updatePrescription);
router.put("/:id/update/:mid", prescriptionController.updatePrescriptionMedicine);

//DELETE
router.delete("/:id", isAuthenticated, prescriptionController.deletePrescription);
router.delete("/:id/deleteMedicine/:mid", prescriptionController.deleteMedicine);


export default router;
