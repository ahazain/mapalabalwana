import axios from "axios";

// Ganti dengan URL backend Anda jika sudah di-deploy
export const API_BASE_URL = "http://localhost:3000";
export const IMAGE_URL = "http://localhost:3000"; // Untuk prefix gambar

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// (Opsional) Interceptor untuk otomatis pasang token jika ada
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
