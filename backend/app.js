const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors");
const cloudinary = require("cloudinary");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const upload = multer(); // Multer to handle form-data

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://192.168.0.26:3000",
  "http://172.31.218.116:3000",
  "https://frontend7-sm0h.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests globally
app.options("*", cors(corsOptions));

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());
app.use(cookieParser());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1/order", order);

// Example logout route
app.post("/api/v1/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true, // Required if frontend is HTTPS
    sameSite: "None", // Required for cross-origin cookies
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
