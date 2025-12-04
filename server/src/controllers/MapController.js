const prisma = require("../configs/prisma");
const fs = require("fs");
const path = require("path"); // Tambahkan ini untuk delete file
const {
  uploadToSupabase,
  deleteFromSupabase,
} = require("../services/storageService");
class MapController {
  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const where = search
        ? { title: { contains: search, mode: "insensitive" } }
        : {};
      const maps = await prisma.mapData.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      res.json({ status: true, data: maps });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // static async create(req, res) {
  //   try {
  //     const data = req.body;

  //     // 1. Handle File
  //     if (req.file) {
  //       data.fileUrl = `/uploads/${req.file.filename}`;
  //       data.fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
  //     } else {
  //       // Jika mode URL (tidak upload file), pastikan field fileUrl ada
  //       if (!data.fileUrl)
  //         return res
  //           .status(400)
  //           .json({ status: false, message: "File atau URL wajib diisi" });
  //       data.fileSize = "External Link";
  //     }

  //     // 2. Handle Latitude & Longitude (PENTING: Cegah NaN/Error)
  //     // Jika string kosong atau null, set ke null. Jika ada angka, parse ke Float.
  //     data.latitude =
  //       data.latitude && data.latitude !== ""
  //         ? parseFloat(data.latitude)
  //         : null;
  //     data.longitude =
  //       data.longitude && data.longitude !== ""
  //         ? parseFloat(data.longitude)
  //         : null;

  //     const map = await prisma.mapData.create({ data });
  //     res.status(201).json({ status: true, data: map });
  //   } catch (error) {
  //     console.error("Create Map Error:", error); // Cek terminal VS Code untuk detail error
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }

  // static async update(req, res) {
  //   try {
  //     const data = req.body;
  //     const id = Number(req.params.id);

  //     // 1. Handle File Baru
  //     if (req.file) {
  //       data.fileUrl = `/uploads/${req.file.filename}`;
  //       data.fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
  //     }

  //     // 2. Handle Lat/Long Update
  //     if (data.latitude !== undefined) {
  //       data.latitude =
  //         data.latitude && data.latitude !== ""
  //           ? parseFloat(data.latitude)
  //           : null;
  //     }
  //     if (data.longitude !== undefined) {
  //       data.longitude =
  //         data.longitude && data.longitude !== ""
  //           ? parseFloat(data.longitude)
  //           : null;
  //     }

  //     // Hapus ID dari body agar tidak error (Prisma tidak mengizinkan update ID)
  //     delete data.id;

  //     const map = await prisma.mapData.update({ where: { id }, data });
  //     res.json({ status: true, data: map });
  //   } catch (error) {
  //     console.error("Update Map Error:", error);
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }

  // static async delete(req, res) {
  //   try {
  //     const id = Number(req.params.id);

  //     // Cek data dulu untuk hapus file fisik (Opsional)
  //     const map = await prisma.mapData.findUnique({ where: { id } });

  //     if (map && map.fileUrl && map.fileUrl.startsWith("/uploads/")) {
  //       const filePath = path.join(__dirname, "../../public", map.fileUrl);
  //       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //     }

  //     await prisma.mapData.delete({ where: { id } });
  //     res.json({ status: true });
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }

  static async create(req, res) {
    try {
      const data = req.body;

      if (req.file) {
        // Hitung size sebelum upload (karena req.file masih ada di memory)
        data.fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

        // Upload ke Supabase
        const url = await uploadToSupabase(req.file);
        data.fileUrl = url;
      } else {
        if (!data.fileUrl)
          return res
            .status(400)
            .json({ status: false, message: "File atau URL wajib diisi" });
        data.fileSize = "External Link";
      }

      data.latitude =
        data.latitude && data.latitude !== ""
          ? parseFloat(data.latitude)
          : null;
      data.longitude =
        data.longitude && data.longitude !== ""
          ? parseFloat(data.longitude)
          : null;

      const map = await prisma.mapData.create({ data });
      res.status(201).json({ status: true, data: map });
    } catch (error) {
      console.error("Create Map Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      const id = Number(req.params.id);
      const oldMap = await prisma.mapData.findUnique({ where: { id } });

      if (req.file) {
        // Hapus file lama
        if (oldMap.fileUrl && !oldMap.fileUrl.startsWith("http")) {
          // Note: Cek logic deleteFromSupabase, biasanya cukup cek apakah url valid supabase
          await deleteFromSupabase(oldMap.fileUrl);
        }

        data.fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
        const url = await uploadToSupabase(req.file);
        data.fileUrl = url;
      }

      if (data.latitude !== undefined) {
        data.latitude =
          data.latitude && data.latitude !== ""
            ? parseFloat(data.latitude)
            : null;
      }
      if (data.longitude !== undefined) {
        data.longitude =
          data.longitude && data.longitude !== ""
            ? parseFloat(data.longitude)
            : null;
      }

      delete data.id;

      const map = await prisma.mapData.update({ where: { id }, data });
      res.json({ status: true, data: map });
    } catch (error) {
      console.error("Update Map Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      const map = await prisma.mapData.findUnique({ where: { id } });

      if (map && map.fileUrl) {
        await deleteFromSupabase(map.fileUrl);
      }

      await prisma.mapData.delete({ where: { id } });
      res.json({ status: true });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = MapController;
