import { Routes, Route, useLocation } from "react-router-dom";


// --- PAGES: AUTH ---
import LoginPage from "./pages/auth/LoginPage"; // Pastikan file ini ada

// --- PAGES: GUEST ---
import Home from "./pages/guest/Home";
import GISPage from "./pages/guest/GISPage";
import NewsPortalPage from "./pages/guest/NewsPortalPage";
import NewsDetailPage from "./pages/guest/NewsDetailPage";
import SistemInformasiPage from "./pages/guest/SistemInformasi";
import BalwanaStorePage from "./pages/guest/BalwanaStore";
import Pengurus from "./pages/guest/Pengurus";
import GunungHutan from "./pages/guest/GunungHutanPage";
import Konservasi from "./pages/guest/KonservasiPage";
import RockClimbing from "./pages/guest/RockClimbingPage";
import Galeri from "./pages/guest/Galeri";
import About from "./pages/guest/TentangKami";
import Kontak from "./pages/guest/Kontak";
import NotFound from "./pages/notfound"; // Pastikan nama file/folder sesuai (misal: NotFound.jsx)

// --- PAGES: ADMIN ---

import ProdukGIS from "./pages/admin/ProdukGIS";
import ProdukPortalBerita from "./pages/admin/NewsPortalAdmin";
import ProdukSistemInformasi from "./pages/admin/SistemInformasiAdmin";
import ProdukBalwanaStore from "./pages/admin/ProdukBalwanaStore";
import PengurusAdmin from "./pages/admin/PengurusAdmin";
import GaleriAdmin from "./pages/admin/GaleriAdmin;";
import DivisiGunungHutan from "./pages/admin/DivisiGunungHutan";
import DivisiKonservasi from "./pages/admin/DivisiKonservasi";
import DivisiRockClimbing from "./pages/admin/DivisiRockClimbing";
import Settings from "./pages/admin/Settings";

// --- PLACEHOLDER COMPONENTS (Hanya jika file belum dibuat) ---
const Produk = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Manajemen Produk Utama</h1>
    <p>Halaman ini adalah parent untuk sub-menu produk.</p>
  </div>
);

const Divisi = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Manajemen Divisi</h1>
    <p>Pilih sub-menu divisi di sidebar.</p>
  </div>
);

const Laporan = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Laporan & Arsip</h1>
    <p>Halaman pelaporan admin.</p>
  </div>
);

function App() {
  const location = useLocation();

  // Cek apakah user berada di halaman admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  // Cek apakah user berada di halaman login
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="App font-sans text-slate-800 bg-[#f9fafe] min-h-screen flex flex-col">
      {/* Navbar: HANYA muncul jika BUKAN halaman admin DAN BUKAN halaman login */}
      {!isAdminRoute && !isLoginPage && <Navbar />}

      <div className="flex flex-1">
        {/* Sidebar: HANYA muncul di halaman Admin */}
        {isAdminRoute && <Sidebar />}

        {/* Main Content Area */}
        {/* Tambahkan margin kiri jika sidebar aktif (Desktop only) */}
        <main className={`flex-1 ${isAdminRoute ? "md:ml-64" : ""}`}>
          <Routes>
            {/* === 1. PUBLIC ROUTES (GUEST) === */}
            <Route path="/" element={<Home />} />
            <Route path="/gis" element={<GISPage />} />
            <Route path="/portalberita" element={<NewsPortalPage />} />
            <Route path="/berita/:id" element={<NewsDetailPage />} />
            <Route path="/pengurus" element={<Pengurus />} />
            <Route path="/divisi/gununghutan" element={<GunungHutan />} />
            <Route path="/divisi/konservasi" element={<Konservasi />} />
            <Route path="/divisi/rockclimbing" element={<RockClimbing />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/sistem-informasi" element={<SistemInformasiPage />} />
            <Route path="/balwana-store" element={<BalwanaStorePage />} />

            {/* === 2. AUTH ROUTE === */}
            <Route path="/login" element={<LoginPage />} />

            {/* === 3. PROTECTED ADMIN ROUTES === */}
            {/* Semua route di dalam ini butuh Token Login */}
            <Route element={<PrivateRoute />}>
              {/* Produk */}
              <Route path="/admin/produk" element={<Produk />} />
              <Route path="/admin/produk/gis" element={<ProdukGIS />} />
              <Route
                path="/admin/produk/portal-berita"
                element={<ProdukPortalBerita />}
              />
              <Route
                path="/admin/produk/sistem-informasi"
                element={<ProdukSistemInformasi />}
              />
              <Route
                path="/admin/produk/balwana-store"
                element={<ProdukBalwanaStore />}
              />

              {/* Divisi */}
              <Route path="/admin/divisi" element={<Divisi />} />
              <Route
                path="/admin/divisi/gunung-hutan"
                element={<DivisiGunungHutan />}
              />
              <Route
                path="/admin/divisi/konservasi"
                element={<DivisiKonservasi />}
              />
              <Route
                path="/admin/divisi/rock-climbing"
                element={<DivisiRockClimbing />}
              />

              {/* Lainnya */}
              <Route path="/admin/pengurus" element={<PengurusAdmin />} />
              <Route path="/admin/galeri" element={<GaleriAdmin />} />
              <Route path="/admin/laporan" element={<Laporan />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* === 4. NOT FOUND (Catch All) === */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Footer: HANYA muncul jika BUKAN halaman admin DAN BUKAN halaman login */}
      {!isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
}

export default App;
