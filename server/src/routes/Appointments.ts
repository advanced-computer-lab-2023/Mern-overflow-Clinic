import express from "express";
import bodyParser from "body-parser";
import appointmentController from "../controllers/AppointmentController.js";

const router = express.Router();
router.use(bodyParser.json());


//GET
router.get("/", appointmentController.listAllAppointments);
router.get("/:id", appointmentController.readAppointment);

//POST
router.post("/", appointmentController.createAppointment);

//DELETE
router.delete("/:id", appointmentController.deleteAppointment);

export default router;