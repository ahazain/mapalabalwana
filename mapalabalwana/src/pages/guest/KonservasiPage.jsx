import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import { IMAGE_URL } from "../../services/Config";

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
  tree: (
    <path d="M12 2L8 8h8l-4-6zM10 8L6 14h12l-4-6M8 14l-4 6h16l-4-6M12 20v2" />
  ),
  leaf: (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  recycle: <path d="M7 7h10v10" />,
  check: <polyline points="20 6 9 17 4 12" />,
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  arrowDown: <path d="M12 5v14M19 12l-7 7-7-7" />,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
};

const KonservasiPage = () => {
  const [materiList, setMateriList] = useState([]);
  const [galeriImages, setGaleriImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDoc = await api.getDocuments();
        if (resDoc.data.status) {
          setMateriList(
            resDoc.data.data
              .filter(
                (d) =>
                  d.type === "Materi" &&
                  d.tags.some((t) => t.includes("Konservasi"))
              )
              .map((d) => ({
                title: d.title,
                desc: d.summary,
                icon: d.authorName || "tree",
              }))
          );
        }
        const resGal = await api.getGalleries();
        if (resGal.data.status) {
          setGaleriImages(
            resGal.data.data.filter((g) => g.category === "Konservasi")
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (url) =>
    !url
      ? "https://via.placeholder.com/400x300"
      : url.startsWith("http")
      ? url
      : `${IMAGE_URL}${url}`;

  return (
    <div className="min-h-screen bg-[#f9fafe] text-slate-800 font-sans selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      <section className="relative h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2000"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur text-green-100 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>{" "}
            Division Status: Active
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            Divisi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
              Konservasi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50/90 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Garda terdepan dalam pelestarian lingkungan, analisis ekosistem, dan
            edukasi alam untuk keberlanjutan bumi.
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
              Lihat Aksi Nyata
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <Icon path={icons.arrowDown} className="w-6 h-6" />
        </div>
      </section>

      <section id="pengertian" className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-100 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative aspect-[4/5] bg-slate-200 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                  alt="Planting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-green-400 font-mono text-xs mb-1">
                    <Icon path={icons.leaf} className="w-4 h-4" />
                    <span>ECO_ACTION_INITIATED</span>
                  </div>
                  <p className="text-white font-bold">
                    Reboisasi Lereng Argopuro
                  </p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[#3F5F9A] font-bold uppercase tracking-wider text-sm mb-2 block">
                Tentang Divisi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Menjaga Nafas Bumi
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Divisi Konservasi berfokus pada studi ilmiah dan tindakan nyata
                untuk melindungi keanekaragaman hayati. Kami menggabungkan data
                lapangan dengan aksi sosial.
              </p>
              <div className="space-y-4">
                {[
                  "Analisis Data Vegetasi & Satwa",
                  "Kampanye Lingkungan & Edukasi",
                  "Pemberdayaan Masyarakat Sekitar Hutan",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-500/30 hover:bg-green-50/30 transition-colors cursor-default group"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
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

      <section id="materi" className="py-24 bg-[#f9fafe]">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#3F5F9A] font-bold tracking-wider uppercase text-sm">
              Kurikulum
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              Metode & Keahlian
            </h2>
            <p className="text-slate-500">
              Pengetahuan dasar yang wajib dikuasai untuk melakukan riset dan
              konservasi yang valid dan berdampak.
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
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Icon
                        path={icons[m.icon] || icons.tree}
                        className="w-6 h-6"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
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

      <section id="galeri" className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Dokumentasi Kegiatan
          </h2>
          {loading ? (
            <div className="text-center text-slate-400">Memuat galeri...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
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
                        <span>CONS_DATA_0{i + 1}</span>
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
              <Icon path={icons.leaf} className="w-5 h-5" />
            </div>
            <p className="font-bold text-lg">Divisi Konservasi.</p>
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

export default KonservasiPage;
