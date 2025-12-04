const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const processImage = require("../middlewares/processImage");
// Import Auth Middleware
const authMiddleware = require("../middlewares/authMiddleware");
const SettingController = require("../controllers/SettingController");
// Import Controllers
const AuthController = require("../controllers/AuthController");
const MemberController = require("../controllers/MemberController");
const ArticleController = require("../controllers/ArticleController");
const ProductController = require("../controllers/ProductController");
const MapController = require("../controllers/MapController");
const DocumentController = require("../controllers/DocumentController");
const GalleryController = require("../controllers/GalleryController");

// --- PUBLIC ROUTES (Bisa diakses siapa saja) ---
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register); // Gunakan sekali saja untuk buat admin, lalu hapus/komentar
router.get("/settings", SettingController.getSettings);

// Get Data untuk Halaman Guest (Public)
router.get("/members", MemberController.getAll);
router.get("/members/:id", MemberController.getById);
router.get("/articles", ArticleController.getAll);
router.get("/articles/:id", ArticleController.getById);
router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getById);
router.get("/maps", MapController.getAll);
router.get("/documents", DocumentController.getAll);
router.get("/galleries", GalleryController.getAll);
// Settings (Untuk Footer/Kontak Guest)
router.get("/settings", SettingController.getSettings);

// --- PROTECTED ROUTES (Hanya Admin yang sudah Login) ---
// Kita pasang authMiddleware di sini


// Settings (Update)
router.put("/settings", authMiddleware, SettingController.updateSettings); // <--- PENYEBAB ERROR 404 (JIKA HILANG)
router.put(
  "/auth/change-password",
  authMiddleware,
  AuthController.changePassword
);

// MANAJEMEN PENGURUS (Create, Update, Delete)
router.post(
  "/members",
  authMiddleware,
  upload.single("photo"),
  processImage,
  MemberController.create
);
router.put(
  "/members/:id",
  authMiddleware,
  upload.single("photo"),
  processImage,
  MemberController.update
);
router.delete("/members/:id", authMiddleware, MemberController.delete);

// MANAJEMEN BERITA
router.post(
  "/articles",
  authMiddleware,
  upload.single("image"),
  processImage,
  ArticleController.create
);
router.put(
  "/articles/:id",
  authMiddleware,
  upload.single("image"),
  processImage,
  ArticleController.update
);
router.delete("/articles/:id", authMiddleware, ArticleController.delete);

// MANAJEMEN TOKO
router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  processImage,
  ProductController.create
);
router.put(
  "/products/:id",
  authMiddleware,
  upload.single("image"),
  processImage,
  ProductController.update
);
router.delete("/products/:id", authMiddleware, ProductController.delete);

// MANAJEMEN GIS
router.post(
  "/maps",
  authMiddleware,
  upload.single("file"),
  processImage,
  MapController.create
);
router.put(
  "/maps/:id",
  authMiddleware,
  upload.single("file"),
  processImage,
  MapController.update
);
router.delete("/maps/:id", authMiddleware, MapController.delete);

// MANAJEMEN DOKUMEN
router.post(
  "/documents",
  authMiddleware,
  upload.single("file"),
  processImage,
  DocumentController.create
);
router.put(
  "/documents/:id",
  authMiddleware,
  upload.single("file"),
  processImage,
  DocumentController.update
);
router.delete("/documents/:id", authMiddleware, DocumentController.delete);

// MANAJEMEN GALERI
router.post(
  "/galleries",
  authMiddleware,
  upload.single("image"),
  processImage,
  GalleryController.create
);
router.put(
  "/galleries/:id",
  authMiddleware,
  upload.single("image"),
  processImage,
  GalleryController.update
);
router.delete("/galleries/:id", authMiddleware, GalleryController.delete);

module.exports = router;
