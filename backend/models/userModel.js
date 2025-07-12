// models/user.js
import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";

const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    location: DataTypes.STRING,
    profile_photo_url: DataTypes.STRING,
    availability: DataTypes.ARRAY(DataTypes.STRING),
    visibility: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default User;
