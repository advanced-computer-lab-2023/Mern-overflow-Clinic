import express from "express";
import bodyParser from "body-parser";
import paymentController from "../controllers/PaymentController.js";

const router = express.Router();
router.use(bodyParser.json());


// credit card payments 

//POST 
router.post("/appointments", paymentController.payCCAppointment);
router.post("/healthPackages", paymentController.payCCHealthPackage);



export default router;