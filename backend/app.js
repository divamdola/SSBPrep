const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors");
const cloudinary = require("cloudinary");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const upload = multer(); // ✅ Multer to handle form-data

// ✅ Use middlewares before routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://172.31.218.116:3000",
      "https://frontend7-sm0h.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.options("*", cors());


app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.json()); // ✅ Parse JSON
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data
app.use(upload.none()); // ✅ Parse form-data (multipart)
app.use(cookieParser());


//Setting up cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Import all routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1/order", order);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
