import express from "express";
import bodyParser from "body-parser";
import paymentController from "../controllers/PaymentController.js";

const router = express.Router();
router.use(bodyParser.json());



//POST
router.post("/appointments", paymentController.payWalletAppointment);
router.post("/healthPackages", paymentController.payWalletHealthPackage);

export default router;