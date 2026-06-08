import express from "express";
import { getMessages, getChats, createChat } from "../controller/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chats", authMiddleware, createChat);
router.get("/messages/:chatId", authMiddleware, getMessages);
router.get("/chats/:username", authMiddleware, getChats);

export default router;