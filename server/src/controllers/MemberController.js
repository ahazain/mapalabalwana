const prisma = require("../configs/prisma");
const {
  uploadToSupabase,
  deleteFromSupabase,
} = require("../services/storageService");

class MemberController {
  static async getAll(req, res) {
    const { period, division } = req.query;
    const where = {};
    if (period) where.period = period;
    if (division) where.division = division;

    const members = await prisma.member.findMany({
      where,
      orderBy: { id: "asc" },
    });
    res.json({ status: true, data: members });
  }

  // static async create(req, res) {
  //   try {
  //     const data = req.body;
  //     if (req.file) data.photo = `/uploads/${req.file.filename}`;

  //     const member = await prisma.member.create({ data });
  //     res
  //       .status(201)
  //       .json({ status: true, message: "Pengurus added", data: member });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async update(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const data = req.body;
  //     if (req.file) data.photo = `/uploads/${req.file.filename}`;

  //     const member = await prisma.member.update({
  //       where: { id: Number(id) },
  //       data,
  //     });
  //     res.json({ status: true, message: "Pengurus updated", data: member });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async delete(req, res) {
  //   await prisma.member.delete({ where: { id: Number(req.params.id) } });
  //   res.json({ status: true, message: "Pengurus deleted" });
  // }

  // CREATE
  static async create(req, res) {
    try {
      const data = req.body;

      // Handle Upload ke Supabase
      if (req.file) {
        const url = await uploadToSupabase(req.file);
        data.photo = url; // Simpan URL lengkap dari Supabase
      }

      const member = await prisma.member.create({ data });

      res.status(201).json({
        status: true,
        message: "Pengurus berhasil ditambahkan",
        data: member,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // UPDATE
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Cek data lama untuk keperluan hapus foto lama
      const oldMember = await prisma.member.findUnique({
        where: { id: Number(id) },
      });
      if (!oldMember)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      if (req.file) {
        // 1. Hapus foto lama di Supabase jika ada
        if (oldMember.photo) {
          await deleteFromSupabase(oldMember.photo);
        }
        // 2. Upload foto baru
        const url = await uploadToSupabase(req.file);
        data.photo = url;
      }

      const member = await prisma.member.update({
        where: { id: Number(id) },
        data,
      });

      res.json({
        status: true,
        message: "Pengurus berhasil diupdate",
        data: member,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE
  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      const member = await prisma.member.findUnique({ where: { id } });

      // Hapus foto di Supabase sebelum hapus data di DB
      if (member && member.photo) {
        await deleteFromSupabase(member.photo);
      }

      await prisma.member.delete({ where: { id } });
      res.json({ status: true, message: "Pengurus berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    const member = await prisma.member.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json({ status: true, data: member });
  }
}

module.exports = MemberController;
