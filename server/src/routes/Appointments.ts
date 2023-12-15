import express from "express";
import bodyParser from "body-parser";
import appointmentController from "../controllers/AppointmentController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/", isAuthenticated, appointmentController.listAllAppointments);

router.put("/refresh",
  isAuthenticated,
  appointmentController.changeToPastAppointment,
);
// router.put("/:id/reschedule",
//   isAuthenticated,
//   appointmentController.rescheduleAppointmentForMyPatient,
// );
router.get("/:id", isAuthenticated, appointmentController.readAppointment);

//POST
router.post("/", isAuthenticated, appointmentController.createAppointment);
router.post("/filter/:id",
  isAuthenticated,
  appointmentController.filterAppointments,
);
router.get("/all/:id",
  isAuthenticated,
  appointmentController.getAllAppointments,
);

router.get("/pendingFollowUps/:id",
  isAuthenticated,
  appointmentController.listAllPendingFllowUps,
);





router.post(
  "/update",
  isAuthenticated,
  appointmentController.updateAppointment,
);
router.post(
  "/createAppointmentsForRelations/:id",
  isAuthenticated,
  appointmentController.createAppointmentForFamilyMember,
);
router.post(
  "/requestFollowUp/:id",
  isAuthenticated,
  appointmentController.requestFollowUp,
);

//2024-12-17T00:00:00.000+00:00
router.put(
  "/r/:id",
  //isAuthenticated,
  appointmentController.rescheduleAppointment,
);

router.put(
  "/cancel/:id",
  isAuthenticated,
  appointmentController.cancelAppointment,
);

//DELETE
router.delete("/:id", isAuthenticated, appointmentController.deleteAppointment);

export default router;
