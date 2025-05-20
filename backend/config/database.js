const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI) // No need for extra options
    .then(() => console.log("MongoDB Database Connected"))
    .catch((err) => console.error("MongoDB Connection Failed:", err.message));
};

module.exports = connectDatabase;
