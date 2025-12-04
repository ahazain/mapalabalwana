const prisma = require("../configs/prisma");
const fs = require("fs");
const path = require("path");
const {
  uploadToSupabase,
  deleteFromSupabase,
} = require("../services/storageService");

class GalleryController {
  // GET ALL
  static async getAll(req, res) {
    try {
      const galleries = await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ status: true, data: galleries });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  // // CREATE
  // static async create(req, res) {
  //   try {
  //     const { title, description, category, date } = req.body;

  //     if (!req.file) {
  //       return res
  //         .status(400)
  //         .json({ status: false, message: "Gambar wajib diupload!" });
  //     }

  //     const imageUrl = `/uploads/${req.file.filename}`;

  //     const gallery = await prisma.gallery.create({
  //       data: {
  //         title,
  //         description,
  //         category,
  //         imageUrl,
  //         date: date ? new Date(date) : new Date(),
  //       },
  //     });

  //     res.status(201).json({
  //       status: true,
  //       message: "Foto berhasil ditambahkan",
  //       data: gallery,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ status: false, error: error.message });
  //   }
  // }

  // // === NEW: UPDATE GALLERY ===
  // static async update(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { title, description, category, date } = req.body;

  //     // Cari data lama
  //     const oldData = await prisma.gallery.findUnique({
  //       where: { id: Number(id) },
  //     });
  //     if (!oldData)
  //       return res.status(404).json({ message: "Data tidak ditemukan" });

  //     let imageUrl = oldData.imageUrl;

  //     // Jika ada file baru, ganti gambar
  //     if (req.file) {
  //       // Hapus file lama
  //       if (oldData.imageUrl && oldData.imageUrl.startsWith("/uploads/")) {
  //         const oldPath = path.join(
  //           __dirname,
  //           "../../public",
  //           oldData.imageUrl
  //         );
  //         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  //       }
  //       imageUrl = `/uploads/${req.file.filename}`;
  //     }

  //     const gallery = await prisma.gallery.update({
  //       where: { id: Number(id) },
  //       data: {
  //         title,
  //         description,
  //         category,
  //         imageUrl,
  //         date: date ? new Date(date) : oldData.date,
  //       },
  //     });

  //     res.json({
  //       status: true,
  //       message: "Galeri berhasil diupdate",
  //       data: gallery,
  //     });
  //   } catch (error) {
  //     console.error("Update Gallery Error:", error);
  //     res.status(500).json({ status: false, error: error.message });
  //   }
  // }

  // // DELETE
  // static async delete(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const gallery = await prisma.gallery.findUnique({
  //       where: { id: Number(id) },
  //     });

  //     if (
  //       gallery &&
  //       gallery.imageUrl &&
  //       gallery.imageUrl.startsWith("/uploads/")
  //     ) {
  //       const filePath = path.join(__dirname, "../../public", gallery.imageUrl);
  //       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //     }

  //     await prisma.gallery.delete({ where: { id: Number(id) } });
  //     res.json({ status: true, message: "Foto berhasil dihapus" });
  //   } catch (error) {
  //     res.status(500).json({ status: false, error: error.message });
  //   }
  // }

  // CREATE
  static async create(req, res) {
    try {
      const { title, description, category, date } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ status: false, message: "Gambar wajib diupload!" });
      }

      const imageUrl = await uploadToSupabase(req.file);

      const gallery = await prisma.gallery.create({
        data: {
          title,
          description,
          category,
          imageUrl,
          date: date ? new Date(date) : new Date(),
        },
      });

      res
        .status(201)
        .json({
          status: true,
          message: "Foto berhasil ditambahkan",
          data: gallery,
        });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  // UPDATE
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, date } = req.body;

      const oldData = await prisma.gallery.findUnique({
        where: { id: Number(id) },
      });
      if (!oldData)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      let imageUrl = oldData.imageUrl;

      if (req.file) {
        if (oldData.imageUrl) await deleteFromSupabase(oldData.imageUrl);
        imageUrl = await uploadToSupabase(req.file);
      }

      const gallery = await prisma.gallery.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          category,
          imageUrl,
          date: date ? new Date(date) : oldData.date,
        },
      });

      res.json({
        status: true,
        message: "Galeri berhasil diupdate",
        data: gallery,
      });
    } catch (error) {
      console.error("Update Gallery Error:", error);
      res.status(500).json({ status: false, error: error.message });
    }
  }

  // DELETE
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const gallery = await prisma.gallery.findUnique({
        where: { id: Number(id) },
      });

      if (gallery && gallery.imageUrl) {
        await deleteFromSupabase(gallery.imageUrl);
      }

      await prisma.gallery.delete({ where: { id: Number(id) } });
      res.json({ status: true, message: "Foto berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
}

module.exports = GalleryController;
