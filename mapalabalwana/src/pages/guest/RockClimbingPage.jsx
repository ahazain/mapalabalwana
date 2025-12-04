import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import { IMAGE_URL } from "../../services/config";

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
  anchor: (
    <>
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="22" x2="12" y2="8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  check: <polyline points="20 6 9 17 4 12" />,
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  arrowDown: <path d="M12 5v14M19 12l-7 7-7-7" />,
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
};

const RockClimbingPage = () => {
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
                  d.tags.some((t) => t.includes("Rock Climbing"))
              )
              .map((d) => ({
                title: d.title,
                desc: d.summary,
                icon: d.authorName || "shield",
              }))
          );
        }
        const resGal = await api.getGalleries();
        if (resGal.data.status) {
          setGaleriImages(
            resGal.data.data.filter((g) => g.category === "Rock Climbing")
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
            src="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=2000"
            alt="Climbing"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-[#f9fafe]"></div>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur text-slate-200 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>{" "}
            Division Status: Active
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            Rock <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">
              Climbing
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Menaklukan ketinggian dengan teknik, kekuatan fisik, dan manajemen
            keselamatan bertaraf internasional.
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
              Lihat Aksi
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
              <div className="absolute -inset-4 bg-slate-200 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522506253022-6617a6633b9a?w=800&q=80"
                  alt="Climber"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-slate-300 font-mono text-xs mb-1">
                    <Icon path={icons.shield} className="w-4 h-4" />
                    <span>SAFETY_FIRST</span>
                  </div>
                  <p className="text-white font-bold">
                    Latihan Pemanjatan Tebing Sepikul
                  </p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[#3F5F9A] font-bold uppercase tracking-wider text-sm mb-2 block">
                Tentang Divisi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Melampaui Batas Vertikal
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Rock Climbing adalah seni bergerak di bidang vertikal. Kami
                melatih mental baja, perhitungan yang matang, dan kepercayaan
                penuh pada tim dan peralatan.
              </p>
              <div className="space-y-4">
                {[
                  "Artificial & Sport Climbing",
                  "Sistem Anchor & Belay Standar UIAA",
                  "Vertical Rescue Response Team",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-400/30 hover:bg-slate-100/50 transition-colors cursor-default group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-700 group-hover:text-white transition-colors">
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
              Teknik & Prosedur
            </h2>
            <p className="text-slate-500">
              Kompetensi teknis yang harus dikuasai untuk memastikan keamanan
              dalam setiap pergerakan vertikal.
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
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-[#3F5F9A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                      <Icon
                        path={icons[m.icon] || icons.shield}
                        className="w-6 h-6"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
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
            Galeri Tebing
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
                        <span>RC_CAM_0{i + 1}</span>
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
              <Icon path={icons.shield} className="w-5 h-5" />
            </div>
            <p className="font-bold text-lg">Divisi Rock Climbing.</p>
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

export default RockClimbingPage;
