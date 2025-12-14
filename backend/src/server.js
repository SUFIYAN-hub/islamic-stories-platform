// backend/src/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Security middleware with CORS fix for static files
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static files for audio and images
app.use("/audio", express.static("public/audio"));
app.use("/images", express.static("public/images"));


// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/islamic-stories"
  )
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Islamic Stories API is running",
    timestamp: new Date().toISOString(),
  });
});

// Load and mount routes
const categoryRoutes = require("./routes/categories");
const storyRoutes = require("./routes/stories");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require('./routes/user');

app.use("/api/categories", categoryRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/user', userRoutes);


// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found - ${req.originalUrl}` 
  });
});

// Error handler - must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.message })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📂 Static files: http://localhost:${PORT}/audio/`);
});

module.exports = app;