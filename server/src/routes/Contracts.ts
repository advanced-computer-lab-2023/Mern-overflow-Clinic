import express from "express";
import bodyParser from "body-parser";
import contractController from "../controllers/ContractController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());



router.get("/:id",contractController.listAllDoctorContracts);

router.put("/",contractController.updateContract);

router.delete("/", contractController.deleteContract);

router.get("/:id",contractController.readContract);


export default router;
