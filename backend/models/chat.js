import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  lastMessage: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);