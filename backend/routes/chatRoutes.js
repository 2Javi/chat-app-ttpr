import express from "express";
import { getMessages, getChats } from "../controller/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/messages/:chatId", authMiddleware, getMessages);
router.get("/chats/:username", authMiddleware, getChats);

export default router;