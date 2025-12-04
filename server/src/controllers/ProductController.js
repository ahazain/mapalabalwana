const prisma = require("../configs/prisma");
const {
  uploadToSupabase,
  deleteFromSupabase,
} = require("../services/storageService");

class ProductController {
  static async getAll(req, res) {
    const { search, category } = req.query;
    const where = {};
    if (category && category !== "Semua") where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: "desc" },
    });
    res.json({ status: true, data: products });
  }

  // static async create(req, res) {
  //   try {
  //     const data = req.body;
  //     if (req.file) data.image = `/uploads/${req.file.filename}`;
  //     data.price = Number(data.price);
  //     data.stock = Number(data.stock);

  //     const product = await prisma.product.create({ data });
  //     res.status(201).json({ status: true, data: product });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async update(req, res) {
  //   try {
  //     const data = req.body;
  //     if (req.file) data.image = `/uploads/${req.file.filename}`;
  //     if (data.price) data.price = Number(data.price);
  //     if (data.stock) data.stock = Number(data.stock);

  //     const product = await prisma.product.update({
  //       where: { id: Number(req.params.id) },
  //       data,
  //     });
  //     res.json({ status: true, data: product });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // static async delete(req, res) {
  //   await prisma.product.delete({ where: { id: Number(req.params.id) } });
  //   res.json({ status: true, message: "Deleted" });
  // }
  static async create(req, res) {
    try {
      const data = req.body;
      data.price = Number(data.price);
      data.stock = Number(data.stock);

      // Upload Supabase
      if (req.file) {
        const url = await uploadToSupabase(req.file);
        data.image = url;
      }

      const product = await prisma.product.create({ data });
      res.status(201).json({ status: true, data: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      const id = Number(req.params.id);

      if (data.price) data.price = Number(data.price);
      if (data.stock) data.stock = Number(data.stock);

      const oldProduct = await prisma.product.findUnique({ where: { id } });

      if (req.file) {
        if (oldProduct.image) await deleteFromSupabase(oldProduct.image);
        const url = await uploadToSupabase(req.file);
        data.image = url;
      }

      const product = await prisma.product.update({ where: { id }, data });
      res.json({ status: true, data: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });

      if (product && product.image) {
        await deleteFromSupabase(product.image);
      }

      await prisma.product.delete({ where: { id } });
      res.json({ status: true, message: "Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Gagal hapus" });
    }
  }
  static async getById(req, res) {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json({ status: true, data: product });
  }
}

module.exports = ProductController;
