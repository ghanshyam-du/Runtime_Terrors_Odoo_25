// models/swapRequestModel.js
import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";

const SwapRequest = sequelize.define("SwapRequest", {
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requesterName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  targetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});

export default SwapRequest;
