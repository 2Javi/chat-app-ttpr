import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

try {
  const connection = await pool.getConnection();
  console.log("✅ Connected to MySQL");
  connection.release();
} catch (error) {
  console.error("❌ MySQL Connection Failed");
  console.error(error);
}

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});