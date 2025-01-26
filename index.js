import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authTwo.js";
import loanRoutes from "./routes/loan.js";
import adminRoutes from "./routes/admin.js";

import 'dotenv/config'

const app = express();

app.use(cors("*"));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://mughees123:abcd123@cluster0.2r2rb.mongodb.net/Money?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));