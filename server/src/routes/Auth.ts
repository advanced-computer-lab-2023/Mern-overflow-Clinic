import express from "express";
import bodyParser from "body-parser";
import authController from "../controllers/AuthController.js";


const router = express.Router();
router.use(bodyParser.json());


router.post("/login", authController.login);
router.post("/logout", authController.logout);


export default router;