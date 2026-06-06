import Message from "../models/messages.js";
import Chat from "../models/chat.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.username }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const createChat = async (req, res) => {
  try {
    const { participants } = req.body;
    const existingChat = await Chat.findOne({
      participants: { $all: participants }
    });
    if (existingChat) return res.json(existingChat);
    const newChat = await Chat.create({ participants });
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};