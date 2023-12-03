import express from "express";

// import fetchChats from "../controllers/chatControllers.js"
// import accessChat from "../controllers/chatControllers.js"
// import createGroupChat from "../controllers/chatControllers.js"
// import removeFromGroup from "../controllers/chatControllers.js"
// import addToGroup from "../controllers/chatControllers.js"
// import renameGroup from "../controllers/chatControllers.js"

import chatControllers from "../controllers/chatControllers.js";


const router = express.Router();

router.route("/").post(chatControllers.accessChat);
router.route("/").get( chatControllers.fetchChats);
router.route("/group").post( chatControllers.createGroupChat);
router.route("/rename").put(chatControllers.renameGroup);
router.route("/groupremove").put( chatControllers.removeFromGroup);
router.route("/groupadd").put(chatControllers.addToGroup);


export default router

