import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  changePassword
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

export default router;