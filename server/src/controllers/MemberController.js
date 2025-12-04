const prisma = require("../configs/prisma");

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

  static async create(req, res) {
    try {
      const data = req.body;
      if (req.file) data.photo = `/uploads/${req.file.filename}`;

      const member = await prisma.member.create({ data });
      res
        .status(201)
        .json({ status: true, message: "Pengurus added", data: member });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (req.file) data.photo = `/uploads/${req.file.filename}`;

      const member = await prisma.member.update({
        where: { id: Number(id) },
        data,
      });
      res.json({ status: true, message: "Pengurus updated", data: member });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    await prisma.member.delete({ where: { id: Number(req.params.id) } });
    res.json({ status: true, message: "Pengurus deleted" });
  }

  static async getById(req, res) {
    const member = await prisma.member.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json({ status: true, data: member });
  }
}

module.exports = MemberController;
