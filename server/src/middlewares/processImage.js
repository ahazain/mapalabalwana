// src/middlewares/processImage.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const processImage = async (req, res, next) => {
  // Jika tidak ada file yang diupload, lanjut
  if (!req.file) return next();

  // Cek Tipe File
  const isImage = req.file.mimetype.startsWith("image/");

  // JIKA PDF: Langsung lanjut, jangan di-resize
  if (!isImage) {
    return next();
  }

  // JIKA GAMBAR: Proses resize & convert ke WebP
  try {
    const originalPath = req.file.path;
    const filenameWithoutExt = path.parse(req.file.filename).name;
    const newFilename = `${filenameWithoutExt}.webp`;
    const outputPath = path.join(req.file.destination, newFilename);

    // Proses menggunakan Sharp
    await sharp(originalPath)
      .resize(800, null, {
        // Lebar max 800px, tinggi menyesuaikan (auto)
        withoutEnlargement: true, // Jangan perbesar jika gambar asli kecil
        fit: "inside",
      })
      .toFormat("webp", { quality: 80 }) // Kompresi ke WebP kualitas 80%
      .toFile(outputPath);

    // Hapus file asli (JPG/PNG) untuk menghemat storage
    fs.unlinkSync(originalPath);

    // Update data req.file agar Controller membaca file WebP yang baru
    req.file.filename = newFilename;
    req.file.path = outputPath;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    console.error("Gagal memproses gambar:", error);
    // Jika error, hapus file asli agar tidak jadi sampah
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res
      .status(500)
      .json({ status: false, message: "Gagal memproses gambar" });
  }
};

module.exports = processImage;
