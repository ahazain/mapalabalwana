const prisma = require("../configs/prisma");
const fs = require("fs");
const path = require("path");
const {
  uploadToSupabase,
  deleteFromSupabase,
} = require("../services/storageService");

class DocumentController {
  // ... (getAll tetap sama) ...
  static async getAll(req, res) {
    try {
      const { type, search } = req.query;
      const where = {};
      if (type && type !== "Semua") where.type = type;
      if (search) where.title = { contains: search, mode: "insensitive" };

      const docs = await prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      res.json({ status: true, data: docs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // // === REVISI CREATE (FILE OPTIONAL) ===
  // static async create(req, res) {
  //   try {
  //     const { title, type, summary, authorName, authorNia, date, tags } =
  //       req.body;

  //     // Validasi dasar (File tidak lagi wajib di sini)
  //     if (!title || !type) {
  //       return res
  //         .status(400)
  //         .json({ status: false, message: "Judul dan Tipe wajib diisi!" });
  //     }

  //     const id = `DOC-${Date.now()}`;

  //     let tagsArray = [];
  //     if (tags) {
  //       tagsArray = Array.isArray(tags)
  //         ? tags
  //         : tags.split(",").map((t) => t.trim());
  //     }

  //     const documentData = {
  //       id: id,
  //       title: title,
  //       type: type,
  //       summary: summary || "",
  //       authorName: authorName || "Admin", // Digunakan untuk menyimpan nama Icon di frontend
  //       authorNia: authorNia || "-",
  //       date: date ? new Date(date) : new Date(),
  //       tags: tagsArray,
  //       // Default values jika tidak ada file
  //       fileUrl: "",
  //       fileType: "INFO", // Default type jika hanya info
  //       fileSize: "-",
  //     };

  //     // Cek jika ada file yang diupload
  //     if (req.file) {
  //       documentData.fileUrl = `/uploads/${req.file.filename}`;
  //       documentData.fileSize =
  //         (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
  //       const ext = req.file.originalname.split(".").pop();
  //       documentData.fileType = ext ? ext.toUpperCase() : "FILE";
  //     }

  //     const doc = await prisma.document.create({ data: documentData });
  //     res
  //       .status(201)
  //       .json({ status: true, message: "Data berhasil disimpan", data: doc });
  //   } catch (error) {
  //     console.error("Create Document Error:", error);
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }

  // // === REVISI UPDATE ===
  // static async update(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { title, type, summary, authorName, authorNia, date, tags } =
  //       req.body;

  //     const updateData = { title, type, summary, authorName, authorNia };

  //     if (date) updateData.date = new Date(date);
  //     if (tags)
  //       updateData.tags = Array.isArray(tags)
  //         ? tags
  //         : tags.split(",").map((t) => t.trim());

  //     if (req.file) {
  //       updateData.fileUrl = `/uploads/${req.file.filename}`;
  //       updateData.fileSize =
  //         (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
  //       const ext = req.file.originalname.split(".").pop();
  //       updateData.fileType = ext ? ext.toUpperCase() : "FILE";
  //     }

  //     const doc = await prisma.document.update({
  //       where: { id: id },
  //       data: updateData,
  //     });
  //     res.json({ status: true, message: "Data berhasil diupdate", data: doc });
  //   } catch (error) {
  //     console.error("Update Document Error:", error);
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }

  // // ... (delete tetap sama) ...
  // static async delete(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const doc = await prisma.document.findUnique({ where: { id } });
  //     if (doc && doc.fileUrl && doc.fileUrl.startsWith("/uploads/")) {
  //       const filePath = path.join(__dirname, "../../public", doc.fileUrl);
  //       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //     }
  //     await prisma.document.delete({ where: { id } });
  //     res.json({ status: true });
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // }
  static async create(req, res) {
    try {
      const { title, type, summary, authorName, authorNia, date, tags } =
        req.body;

      if (!title || !type) {
        return res
          .status(400)
          .json({ status: false, message: "Judul dan Tipe wajib diisi!" });
      }

      const id = `DOC-${Date.now()}`;

      let tagsArray = [];
      if (tags) {
        tagsArray = Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim());
      }

      const documentData = {
        id: id,
        title: title,
        type: type,
        summary: summary || "",
        authorName: authorName || "Admin",
        authorNia: authorNia || "-",
        date: date ? new Date(date) : new Date(),
        tags: tagsArray,
        fileUrl: "",
        fileType: "INFO",
        fileSize: "-",
      };

      if (req.file) {
        const size = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
        const ext = req.file.originalname.split(".").pop().toUpperCase();

        const url = await uploadToSupabase(req.file);

        documentData.fileUrl = url;
        documentData.fileSize = size;
        documentData.fileType = ext;
      }

      const doc = await prisma.document.create({ data: documentData });
      res
        .status(201)
        .json({
          status: true,
          message: "Dokumen berhasil ditambahkan",
          data: doc,
        });
    } catch (error) {
      console.error("Create Document Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, type, summary, authorName, authorNia, date, tags } =
        req.body;

      const updateData = { title, type, summary, authorName, authorNia };

      if (date) updateData.date = new Date(date);
      if (tags)
        updateData.tags = Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim());

      if (req.file) {
        const oldDoc = await prisma.document.findUnique({ where: { id } });
        if (oldDoc && oldDoc.fileUrl) await deleteFromSupabase(oldDoc.fileUrl);

        const size = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
        const ext = req.file.originalname.split(".").pop().toUpperCase();
        const url = await uploadToSupabase(req.file);

        updateData.fileUrl = url;
        updateData.fileSize = size;
        updateData.fileType = ext;
      }

      const doc = await prisma.document.update({
        where: { id: id },
        data: updateData,
      });
      res.json({
        status: true,
        message: "Dokumen berhasil diupdate",
        data: doc,
      });
    } catch (error) {
      console.error("Update Document Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const doc = await prisma.document.findUnique({ where: { id } });

      if (doc && doc.fileUrl) {
        await deleteFromSupabase(doc.fileUrl);
      }

      await prisma.document.delete({ where: { id } });
      res.json({ status: true });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = DocumentController;
