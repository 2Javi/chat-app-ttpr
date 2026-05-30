import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const signup = async (req, res) => {
  try {
    const { username, name, email, phone, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "Username, name, email, and password are required",
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
       (username, name, email, phone, password_hash) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, name, email, phone || null, passwordHash]
    );

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_picture: user.profile_picture,
        bio: user.bio,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, name, email, phone, profile_picture, bio, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error("GetMe error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      users[0].password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newPasswordHash, req.user.id]
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error during password change",
    });
  }
};