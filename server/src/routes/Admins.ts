import express from "express";
import bodyParser from "body-parser";
import adminstratorController from "../controllers/AdminstratorController.js";
import contractController from "../controllers/ContractController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]), adminstratorController.listAdminstrators);
router.get("/requests", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]), adminstratorController.viewRequest);

//POST
router.post("/:id/createContract", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]),contractController.createContract);

router.post("/", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]),adminstratorController.createAdminstrator);
router.post("/acceptDoctorRequest",isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]),isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]), adminstratorController.acceptDoctorRequest);
router.post("/rejectDoctorRequest", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]),adminstratorController.rejectDoctorRequest);

//DELETE
router.delete("/:id", isAuthenticated,isAuthorized([UserType.ADMINSTARTOR]),adminstratorController.deleteAdmin);

export default router;
