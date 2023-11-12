import express from "express";
import bodyParser from "body-parser";
import appointmentController from "../controllers/AppointmentController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/", isAuthenticated, appointmentController.listAllAppointments);
router.get("/:id", isAuthenticated, appointmentController.readAppointment);

//POST
router.post("/", isAuthenticated, appointmentController.createAppointment);
router.post(
  "/:id/filter",
  isAuthenticated,
  appointmentController.filterAppointments,
);
router.post(
  "/update",
  isAuthenticated,
  appointmentController.updateAppointment,
);

//DELETE
router.delete("/:id", isAuthenticated, appointmentController.deleteAppointment);

export default router;
