import express from "express";
import bodyParser from "body-parser";
import authController from "../controllers/AuthController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());

router.post("/login", authController.login);
router.post("/logout", isAuthenticated, authController.logout);
// router.post("/forgot", PasswordResetTokenController.sendPasswordResetToken);
// router.get("/reset", PasswordResetTokenController.validatePasswordResetToken);
router.post("/reset", authController.resetPassword);
router.post("/change", isAuthenticated, authController.changePassword);

export default router;
