import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { IMAGE_URL } from "../../services/Config";

/* --- 1. ICON COMPONENTS --- */
const Icon = ({ path, className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    {path}
  </svg>
);

const icons = {
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  map: (
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  arrowDown: <path d="M12 5v14M19 12l-7 7-7-7" />,
  anchor: (
    <>
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="22" x2="12" y2="8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </>
  ),
  tree: (
    <path d="M12 2L8 8h8l-4-6zM10 8L6 14h12l-4-6M8 14l-4 6h16l-4-6M12 20v2" />
  ),
  leaf: (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
  ),
};

const GunungHutanPage = () => {
  const [materiList, setMateriList] = useState([]);
  const [galeriImages, setGaleriImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Materi
        const resDoc = await api.getDocuments();
        if (resDoc.data.status) {
          const filtered = resDoc.data.data
            .filter(
              (d) =>
                d.type === "Materi" &&
                d.tags.some((t) => t.includes("Gunung Hutan"))
            )
            .map((d) => ({
              title: d.title,
              desc: d.summary,
              icon: d.authorName || "activity", // Menggunakan field authorName untuk menyimpan nama icon
            }));
          setMateriList(filtered);
        }

        // 2. Get Galeri
        const resGal = await api.getGalleries();
        if (resGal.data.status) {
          const filtered = resGal.data.data.filter(
            (g) => g.category === "Gunung Hutan"
          );
          setGaleriImages(filtered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] text-slate-800 font-sans selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2000"
            alt="Forest"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-[#f9fafe]"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur text-blue-100 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Division Status: Active
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            Gunung <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              & Hutan
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50/90 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Divisi teknis yang berfokus pada kemampuan bertahan hidup, navigasi
            presisi, dan manajemen perjalanan di hutan tropis.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#materi"
              className="px-8 py-3.5 bg-[#3F5F9A] text-white font-bold rounded-full hover:bg-blue-700 shadow-lg transition-all transform hover:-translate-y-1"
            >
              Pelajari Materi
            </a>
            <a
              href="#galeri"
              className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
            >
              Lihat Dokumentasi
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <Icon path={icons.arrowDown} className="w-6 h-6" />
        </div>
      </section>

      {/* DEFINITION SECTION */}
      <section id="pengertian" className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#3F5F9A]/10 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative aspect-[4/5] bg-slate-200 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80"
                  alt="Navigasi"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-1">
                    <Icon path={icons.compass} className="w-4 h-4" />
                    <span>COORDINATES_LOCKED</span>
                  </div>
                  <p className="text-white font-bold">Latihan Navigasi Darat</p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[#3F5F9A] font-bold uppercase tracking-wider text-sm mb-2 block">
                Tentang Divisi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Rimba Adalah Laboratorium
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Bagi Divisi Gunung Hutan, mendaki bukan sekadar mencapai puncak.
                Ini adalah tentang menguasai data medan, memahami vegetasi, dan
                kembali dengan selamat.
              </p>
              <div className="space-y-4">
                {[
                  "Navigasi Berbasis Peta & Digital",
                  "Manajemen Logistik Terukur",
                  "Analisis Vegetasi & Botani Praktis",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#3F5F9A]/30 hover:bg-blue-50/30 transition-colors cursor-default group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#3F5F9A]/10 flex items-center justify-center text-[#3F5F9A] group-hover:bg-[#3F5F9A] group-hover:text-white transition-colors">
                      <Icon path={icons.check} className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATERI GRID */}
      <section id="materi" className="py-24 bg-[#f9fafe]">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#3F5F9A] font-bold tracking-wider uppercase text-sm">
              Kurikulum
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Materi & Keahlian
            </h2>
            <p className="text-slate-500">
              Standar kompetensi yang wajib dikuasai oleh anggota spesialisasi
              Gunung Hutan untuk menjamin keselamatan dan keberhasilan
              ekspedisi.
            </p>
          </div>
          {loading ? (
            <div className="text-center text-slate-400">Memuat materi...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiList.length > 0 ? (
                materiList.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3F5F9A] to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-12 h-12 bg-[#3F5F9A]/5 rounded-xl flex items-center justify-center text-[#3F5F9A] mb-6 group-hover:bg-[#3F5F9A] group-hover:text-white transition-colors">
                      <Icon
                        path={icons[m.icon] || icons.activity}
                        className="w-6 h-6"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#3F5F9A] transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-400">
                  Belum ada materi.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* GALERI (BENTO GRID) */}
      <section id="galeri" className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Rekam Jejak
          </h2>
          {loading ? (
            <div className="text-center text-slate-400">Memuat galeri...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
              {galeriImages.length > 0 ? (
                galeriImages.map((item, i) => (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                      i === 0
                        ? "col-span-2 row-span-2"
                        : "col-span-1 row-span-1"
                    }`}
                  >
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-1 text-white/80 text-xs mb-1 font-mono">
                        <Icon path={icons.camera} className="w-3 h-3" />
                        <span>IMG_0{i + 1}.RAW</span>
                      </div>
                      <p className="font-bold text-white text-sm md:text-base">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-400 py-10 border border-dashed rounded-xl">
                  Belum ada foto galeri.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#3F5F9A] text-white py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon path={icons.compass} className="w-5 h-5" />
            </div>
            <p className="font-bold text-lg">Divisi Gunung Hutan.</p>
          </div>
          <div className="flex gap-6 text-sm text-blue-100">
            <a href="#materi" className="hover:text-white transition-colors">
              Materi
            </a>
            <a href="#galeri" className="hover:text-white transition-colors">
              Galeri
            </a>
          </div>
          <p className="text-xs text-blue-200">
            © 2025 Mapala Balwana Fasilkom
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GunungHutanPage;
