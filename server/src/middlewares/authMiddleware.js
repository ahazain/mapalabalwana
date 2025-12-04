const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari Header (Authorization: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Ambil kata kedua setelah "Bearer"

  if (!token) {
    return res
      .status(401)
      .json({
        status: false,
        message: "Akses ditolak! Token tidak ditemukan.",
      });
  }

  try {
    // 2. Verifikasi Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Simpan data user ke dalam request agar bisa dipakai di Controller
    req.user = decoded;

    next(); // Lanjut ke controller
  } catch (error) {
    return res
      .status(403)
      .json({ status: false, message: "Token tidak valid atau kadaluarsa." });
  }
};

module.exports = authMiddleware;
