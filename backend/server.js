const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" }); // ✅ Load first

const app = require("./app");
const connectDatabase = require("./config/database");

const multer = require("multer");
const upload = multer();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down Server due to Uncaught Exception");
  process.exit(1);
});

app.use(upload.none());

// Connecting to Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server starting at localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handle Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down server`);
  server.close(() => {
    process.exit(1);
  });
});
