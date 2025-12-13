const express = require("express");
const app = express();
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth.routes");

// -----------------------------
// MIDDLEWARES
// -----------------------------

// Allows JSON request bodies
app.use(express.json());

// Allow requests from frontend (React, Vue, etc.)
app.use(cors());

// Simple custom logger (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// -----------------------------
// ROUTES
// -----------------------------

app.use("/auth", authRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend is running 🚀 Horray");
});

// -----------------------------
// ERROR HANDLER (optional basic)
// -----------------------------

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;