import express from "express";


import messageControllers from "../controllers/messageControllers.js";

const router = express.Router();

router.route("/:chatId").get(messageControllers.allMessages);
router.route("/").post(messageControllers.sendMessage);



export default router;
