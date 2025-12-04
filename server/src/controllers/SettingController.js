const prisma = require("../configs/prisma");

class SettingController {
  // GET Settings (Public)
  static async getSettings(req, res) {
    try {
      // Cari data dengan ID 1
      let settings = await prisma.organization.findUnique({
        where: { id: 1 },
      });

      // Jika belum ada (pertama kali install), buat default
      if (!settings) {
        settings = await prisma.organization.create({
          data: {
            id: 1,
            name: "Mapala Balwana",
            email: "info@balwana.org",
            address: "Kampus Universitas...",
            phone: "+62...",
            instagram: "https://instagram.com",
          },
        });
      }

      res.json({ status: true, data: settings });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // UPDATE Settings (Admin Only)
  static async updateSettings(req, res) {
    try {
      const data = req.body;

      // Hapus field yang tidak boleh diupdate manual
      delete data.id;
      delete data.updatedAt;

      const settings = await prisma.organization.upsert({
        where: { id: 1 },
        update: data,
        create: {
          id: 1,
          ...data,
        },
      });

      res.json({
        status: true,
        message: "Pengaturan berhasil disimpan",
        data: settings,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = SettingController;
