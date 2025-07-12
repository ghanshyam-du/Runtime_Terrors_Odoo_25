// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import cloudinary from "../configs/cloudinary.js";

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
        profile_photo_url: user.profile_photo_url,
        availability: user.availability,
        skills_offered: user.skills_offered,
        skills_wanted: user.skills_wanted,
        visibility: user.visibility,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      name,
      location,
      profilePublic,
      skillsOffered,
      skillsWanted,
      availability,
    } = req.body;

    // ✅ Basic fields
    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = location;
    if (profilePublic !== undefined) {
      user.visibility = profilePublic === "true" || profilePublic === true;
    }

    // ✅ Convert to arrays (handle both string and array formats)
    const toArray = (field) =>
      field === undefined ? undefined : Array.isArray(field) ? field : [field];

    const offeredArray = toArray(skillsOffered);
    const wantedArray = toArray(skillsWanted);
    const availabilityArray = toArray(availability);

    if (offeredArray !== undefined) user.skills_offered = offeredArray;
    if (wantedArray !== undefined) user.skills_wanted = wantedArray;
    if (availabilityArray !== undefined) user.availability = availabilityArray;

    // ✅ Handle profile picture upload
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: "skill_swap_profile_pics",
            transformation: [{ width: 300, height: 300, crop: "limit" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        upload.end(req.file.buffer);
      });

      user.profile_photo_url = result.secure_url;
    }

    await user.save();

    return res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        location: user.location,
        profile_photo_url: user.profile_photo_url,
        availability: user.availability,
        skills_offered: user.skills_offered,
        skills_wanted: user.skills_wanted,
        visibility: user.visibility,
      },
    });
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    return res
      .status(500)
      .json({ error: "Server error during profile update" });
  }
};
