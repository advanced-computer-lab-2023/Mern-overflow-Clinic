import express from "express";
import bodyParser from "body-parser";
import adminstratorController from "../controllers/AdminstratorController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/", adminstratorController.listAdminstrators)
router.get("/requests", adminstratorController.viewRequest)

//POST
router.post("/", adminstratorController.createAdminstrator);
router.post("/acceptDoctor/:id", adminstratorController.acceptDoctorRequest);
router.post("/rejectDoctor/:id", adminstratorController.rejectDoctorRequest);

//DELETE
router.delete("/:id", adminstratorController.deleteAdmin);

export default router;
