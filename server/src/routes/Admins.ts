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
router.get("/", isAuthenticated, adminstratorController.listAdminstrators);
router.get("/requests", isAuthenticated, adminstratorController.viewRequest);

//POST
router.post("/", isAuthenticated, adminstratorController.createAdminstrator);
router.post("/:id/createContract",contractController.createContract);

//DELETE
router.delete("/:id", isAuthenticated, adminstratorController.deleteAdmin);

export default router;
