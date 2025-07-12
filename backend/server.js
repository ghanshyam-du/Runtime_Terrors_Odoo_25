import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes would go here
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true }) // ✅ Correct!
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB sync error:", err));
