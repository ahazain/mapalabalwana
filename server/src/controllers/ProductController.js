const prisma = require("../configs/prisma");

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

  static async create(req, res) {
    try {
      const data = req.body;
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      data.price = Number(data.price);
      data.stock = Number(data.stock);

      const product = await prisma.product.create({ data });
      res.status(201).json({ status: true, data: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      if (data.price) data.price = Number(data.price);
      if (data.stock) data.stock = Number(data.stock);

      const product = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data,
      });
      res.json({ status: true, data: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ status: true, message: "Deleted" });
  }

  static async getById(req, res) {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json({ status: true, data: product });
  }
}

module.exports = ProductController;
