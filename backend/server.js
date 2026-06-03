import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectMongoDB from "./config/chatDB.js";
import Message from "./models/messages.js";
import Chat from "./models/chat.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.username);

  socket.on("join_room", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send_message", async ({ chatId, message }) => {
    const newMessage = await Message.create({
      chatId,
      sender: socket.user.username,
      content: message,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message,
      updatedAt: new Date(),
    });

    io.to(chatId).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.username);
  });
});

const startServer = async () => {
  // Connect MySQL
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed - continuing anyway");
  }

  // Connect MongoDB
  await connectMongoDB();

  server.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
};

startServer();