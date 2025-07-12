import User from "../models/userModel.js";

export const getPublicUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        visibility: true,
      },
      attributes: [
        "id",
        "name",
        "email",
        "location",
        "profile_photo_url",
        "skills_offered",
        "skills_wanted",
        "availability",
      ],
    });

    const filtered = users.filter(
      (u) => u.skills_offered?.length > 0 || u.skills_wanted?.length > 0
    );

    res.json({ users: filtered });
  } catch (err) {
    console.error("❌ getPublicUsers error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
