import express from "express";
import bodyParser from "body-parser";
import notificationController from "../controllers/NotificationController.js";
import isAuthorized from "../middlewares/permissions/isAuthorized.js";
import { UserType } from "../enums/UserTypes.js";

const router = express.Router();
router.use(bodyParser.json());

router.get("/:id", notificationController.listNotifiactions);

router.post("/", notificationController.createNotification);


// router.delete("/", notificationController.deleteContract);

// router.get("/:id",notificationController.readContract);

export default router;
