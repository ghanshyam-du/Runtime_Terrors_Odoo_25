// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const signup = async (req, res) => {
  const { name, email, password, location } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, location });

    res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        location: user.location,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
};
