const prisma = require("../configs/prisma");
const fs = require("fs");
const path = require("path");

class ArticleController {
  // --- GET ALL ---
  static async getAll(req, res) {
    try {
      const { search, category, limit } = req.query;
      const where = {};

      if (category && category !== "Semua") where.category = category;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      const articles = await prisma.article.findMany({
        where,
        take: limit ? Number(limit) : undefined,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      });

      res.json({ status: true, data: articles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- GET BY ID ---
  static async getById(req, res) {
    try {
      const { id } = req.params;
      // Cek apakah ID berupa angka atau slug string
      const where = isNaN(Number(id)) ? { slug: id } : { id: Number(id) };

      const article = await prisma.article.findUnique({
        where,
        include: { author: true },
      });

      if (!article)
        return res
          .status(404)
          .json({ status: false, message: "Berita tidak ditemukan" });

      res.json({ status: true, data: article });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- CREATE ---
  static async create(req, res) {
    try {
      // 1. Destrukturisasi data dari body
      const { title, excerpt, content, category, tags, status, readTime } =
        req.body;

      // 2. Validasi sederhana
      if (!title || !content) {
        return res
          .status(400)
          .json({ status: false, message: "Judul dan Konten wajib diisi" });
      }

      // 3. Generate Slug (title-timestamp)
      const slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

      // 4. Proses Tags (String "a,b,c" -> Array ["a", "b", "c"])
      let tagsArray = [];
      if (tags) {
        tagsArray = Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim());
      }

      // 5. Siapkan Payload
      const articleData = {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        category: category || "Umum",
        tags: tagsArray,
        status: status || "DRAFT",
        // PENTING: Hardcode authorId ke 1 (Admin Pertama) atau ambil dari req.user.id jika sudah login
        authorId: req.user ? req.user.id : 1,
        image: null,
      };

      // 6. Handle Image
      if (req.file) {
        articleData.image = `/uploads/${req.file.filename}`;
      }

      // 7. Simpan ke DB
      const article = await prisma.article.create({ data: articleData });
      res
        .status(201)
        .json({
          status: true,
          message: "Berita berhasil dibuat",
          data: article,
        });
    } catch (error) {
      console.error("Create Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // --- UPDATE ---
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, excerpt, content, category, tags, status } = req.body;

      // 1. Cari artikel lama
      const oldArticle = await prisma.article.findUnique({
        where: { id: Number(id) },
      });
      if (!oldArticle)
        return res
          .status(404)
          .json({ status: false, message: "Data tidak ditemukan" });

      // 2. Proses Tags
      let tagsArray = undefined;
      if (tags) {
        tagsArray = Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim());
      }

      // 3. Siapkan Data Update (Hanya field yang ada)
      const updateData = {
        title,
        excerpt,
        content,
        category,
        status,
        tags: tagsArray,
      };

      // 4. Handle Image Update
      if (req.file) {
        // Hapus gambar lama jika ada dan bukan link eksternal
        if (oldArticle.image && oldArticle.image.startsWith("/uploads/")) {
          const oldPath = path.join(
            __dirname,
            "../../public",
            oldArticle.image
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updateData.image = `/uploads/${req.file.filename}`;
      }

      // 5. Eksekusi Update
      const article = await prisma.article.update({
        where: { id: Number(id) },
        data: updateData,
      });

      res.json({
        status: true,
        message: "Berita berhasil diupdate",
        data: article,
      });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // --- DELETE ---
  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      // Cari data untuk hapus gambar
      const article = await prisma.article.findUnique({ where: { id } });

      if (article && article.image && article.image.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "../../public", article.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await prisma.article.delete({ where: { id } });
      res.json({ status: true, message: "Deleted" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = ArticleController;
