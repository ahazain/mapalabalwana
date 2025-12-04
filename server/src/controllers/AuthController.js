const prisma = require("../configs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // 1. REGISTER (Hanya untuk membuat Admin pertama kali)
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Cek apakah email sudah ada
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Email sudah terdaftar!" });
      }

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Simpan User
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      res.status(201).json({
        status: true,
        message: "Admin berhasil didaftarkan",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // 2. LOGIN
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Cek User
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User tidak ditemukan" });
      }

      // Cek Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Password salah" });
      }

      // Buat Token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token berlaku 1 hari
      );

      res.json({
        status: true,
        message: "Login berhasil",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // 3. CHANGE PASSWORD (YANG HILANG SEBELUMNYA)
  static async changePassword(req, res) {
    try {
      // ID User didapat dari Middleware (req.user)
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({
            status: false,
            message: "Password lama dan baru wajib diisi",
          });
      }

      // Cek User di DB
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user)
        return res
          .status(404)
          .json({ status: false, message: "User tidak ditemukan" });

      // Cek Password Lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ status: false, message: "Password lama salah" });

      // Hash Password Baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update di DB
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword },
      });

      res.json({ status: true, message: "Password berhasil diubah" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = AuthController;
