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
<<<<<<< HEAD
router.post("/", appointmentController.createAppointment);
router.post("/filter", appointmentController.filterAppointments);
router.post("/update" , appointmentController.updateAppointment);
router.post("/createAppointmentsForRelations/:id", appointmentController.createAppointmentForFamilyMember);
=======
router.post("/", isAuthenticated, appointmentController.createAppointment);
router.post(
  "/filter",
  isAuthenticated,
  appointmentController.filterAppointments,
);
router.post(
  "/update",
  isAuthenticated,
  appointmentController.updateAppointment,
);
>>>>>>> 41df4702cbf76f49321e76064bc133d8de0799fe

//DELETE
router.delete("/:id", isAuthenticated, appointmentController.deleteAppointment);

export default router;
