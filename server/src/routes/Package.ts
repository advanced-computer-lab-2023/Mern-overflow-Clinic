import express from "express";
import bodyParser from "body-parser";
import packageController from "../controllers/PackageController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

//GET
router.get("/:id", isAuthenticated, packageController.readPackage);
router.get("/", isAuthenticated, packageController.listPackages);

//POST
router.post("/", isAuthenticated, packageController.createPackage);
router.post("/", isAuthenticated, packageController.createPackage);

//PUT
router.put("/:id", isAuthenticated, packageController.updatePackage);
router.put("/:id", isAuthenticated, packageController.updatePackage);

//DELETE
router.delete("/:id", isAuthenticated, packageController.deletePackage);
router.delete("/:id", isAuthenticated, packageController.deletePackage);

export default router;
