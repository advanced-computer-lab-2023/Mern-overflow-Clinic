import express from "express";
import bodyParser from "body-parser";
import packageController from "../controllers/PackageController.js";

const router = express.Router();
router.use(bodyParser.json());


//GET
router.get("/:id", packageController.readPackage);
router.get("/", packageController.listPackages);

//POST
router.post("/", packageController.createPackage);
router.post("/",packageController.createPackage);

//PUT
router.put("/:id", packageController.updatePackage);
router.put("/:id", packageController.updatePackage);

//DELETE
router.delete("/:id", packageController.deletePackage);
router.delete("/:id", packageController.deletePackage);

export default router;
