import apiClient from "./config";

const Api = {
  // ==========================================
  // PUBLIC / GUEST REQUESTS (GET ONLY)
  // ==========================================

  // Produk (Store)
  getProducts: () => apiClient.get("/products"),
  getProductById: (id) => apiClient.get(`/products/${id}`),

  // Berita (News)
  getArticles: () => apiClient.get("/articles"),
  getArticleById: (id) => apiClient.get(`/articles/${id}`),

  // Pengurus (Members)
  getMembers: () => apiClient.get("/members"),
  getMemberById: (id) => apiClient.get(`/members/${id}`),

  // GIS (Maps)
  getMaps: () => apiClient.get("/maps"),

  // Galeri
  getGalleries: () => apiClient.get("/galleries"),

  // Dokumen Internal (Sistem Informasi)
  getDocuments: () => apiClient.get("/documents"),

  // ==========================================
  // ADMIN / PROTECTED REQUESTS (CRUD)
  // ==========================================

  // --- AUTH ---
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (data) => apiClient.post("/auth/register", data), // Opsional


  // --- MANAJEMEN PRODUK (STORE) ---
  createProduct: (data) =>
    apiClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id, data) =>
    apiClient.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),

  // --- MANAJEMEN BERITA (NEWS) ---
  createArticle: (data) =>
    apiClient.post("/articles", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateArticle: (id, data) =>
    apiClient.put(`/articles/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteArticle: (id) => apiClient.delete(`/articles/${id}`),

  // --- MANAJEMEN PETA (GIS) ---
  createMap: (data) =>
    apiClient.post("/maps", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateMap: (id, data) =>
    apiClient.put(`/maps/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMap: (id) => apiClient.delete(`/maps/${id}`),

  // --- MANAJEMEN PENGURUS ---
  createMember: (data) =>
    apiClient.post("/members", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateMember: (id, data) =>
    apiClient.put(`/members/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),

  // --- MANAJEMEN DOKUMEN (SISTEM INFORMASI) ---
  createDocument: (data) =>
    apiClient.post("/documents", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateDocument: (id, data) =>
    apiClient.put(`/documents/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`),

  // --- MANAJEMEN GALERI ---
  createGallery: (data) =>
    apiClient.post("/galleries", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateGallery: (id, data) =>
    apiClient.put(`/galleries/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteGallery: (id) => apiClient.delete(`/galleries/${id}`),

  updatePassword: (data) => apiClient.put("/auth/change-password", data),
  getSettings: () => apiClient.get("/settings"),
  updateSettings: (data) => apiClient.put("/settings", data),
};

export default Api;
