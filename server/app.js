require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const router = require("./src/routes"); // Kita akan buat ini di langkah 3

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder public untuk akses gambar (http://localhost:5000/uploads/namafile.jpg)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// --- ROUTING ---
app.use("/api/v1", router);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ status: false, message: err.message || "Internal Server Error" });
});

module.exports = app;
