import express from "express";
import bodyParser from "body-parser";
import contractController from "../controllers/ContractController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());



router.get("/",contractController.listAllContracts);
router.get("/:id",contractController.readContract);

router.post("/",contractController.createContract);

router.put("/",contractController.updateContract);

router.delete("/", contractController.deleteContract);


export default router;
