import express from "express";
import bodyParser from "body-parser";
import packageController from "../controllers/PackageController.js";

const router = express.Router();
router.use(bodyParser.json());


//GET
router.get("/packages/:id", packageController.readPackage);
router.get("/packages", packageController.listPackages);

//POST
router.post("/packages", packageController.createPackage);
router.post("/packages",packageController.createPackage);

//PUT
router.put("/packages/:id", packageController.updatePackage);
router.put("/packages/:id", packageController.updatePackage);

//DELETE
router.delete("/packages/:id", packageController.deletePackage);
router.delete("/packages/:id", packageController.deletePackage);

export default router;
