import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  Newspaper,
  Database,
  Store,
  Mountain,
  Trees,
  Shield,
  ArrowRight,
  Play,
  ChevronRight,
  Users,
  Globe, // Tambahan icon
  Award, // Tambahan icon
} from "lucide-react";

// IMPORT GAMBAR DARI ASSETS
import mapImage from "../../assets/peta-indonesia.png";
import balwanaImage from "../../assets/balwana.jpg";

/* --- UTILS: SCROLL REVEAL COMPONENT --- */
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  );
};

/* --- DATA CONSTANTS --- */

const heroImages = [
  "https://images.unsplash.com/photo-1714788905881-0986afdc2011?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1714788905554-9189a3b415c1?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1714788905702-09bb347e248d?w=600&auto=format&fit=crop&q=60",
];

const produkItems = [
  {
    name: "Sistem Informasi Geografi",
    icon: <Map className="w-6 h-6" />,
    desc: "Peta digital interaktif dan analisis spasial wilayah eksplorasi.",
  },
  {
    name: "Portal Berita",
    icon: <Newspaper className="w-6 h-6" />,
    desc: "Informasi terkini kegiatan mapala dan isu lingkungan.",
  },
  {
    name: "Sistem Informasi Internal",
    icon: <Database className="w-6 h-6" />,
    desc: "Manajemen data anggota, logistik, dan administrasi.",
  },
  {
    name: "Balwana Store",
    icon: <Store className="w-6 h-6" />,
    desc: "Official merchandise dan penyewaan alat outdoor.",
  },
];

const divisiItems = [
  {
    name: "Gunung Hutan",
    icon: <Mountain className="w-6 h-6" />,
    desc: "Manajemen perjalanan, navigasi darat, dan survival di hutan tropis.",
  },
  {
    name: "Konservasi",
    icon: <Trees className="w-6 h-6" />,
    desc: "Analisis vegetasi, reboisasi berbasis data, dan edukasi lingkungan.",
  },
  {
    name: "Rock Climbing",
    icon: <Shield className="w-6 h-6" />,
    desc: "Pemanjatan tebing alam & buatan dengan standar safety prosedur.",
  },
];

const newsItems = [
  {
    title: "Pemetaan Jalur Pendakian Argopuro Berbasis GIS",
    date: "2 Des 2025",
    category: "Riset",
    image:
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  },
  {
    title: "Pelatihan Dasar Navigasi Angkatan 24",
    date: "28 Nov 2025",
    category: "Diklat",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
  },
  {
    title: "Monitoring Hutan Menggunakan Drone",
    date: "15 Nov 2025",
    category: "Teknologi",
    image:
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80",
  },
];

const galleryItems = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=800&q=80",
  "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80",
  "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=800&q=80",
];

/* --- MAIN COMPONENT --- */

const Home = () => {
  const [activeCard, setActiveCard] = useState(0);

  // Auto-rotate hero cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    setActiveCard((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-white text-[#3F5F9A] font-sans overflow-x-hidden selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* --- CSS Styles for custom animations --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-br from-white to-[#f2f5ff]">
        {/* BACKGROUND: PETA INDONESIA (WATERMARK) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08] mix-blend-multiply animate-pulse-soft">
          <img
            src={mapImage}
            alt="Peta Indonesia"
            className="w-[90%] md:w-[80%] h-auto object-contain grayscale"
          />
        </div>

        <div className="container max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="space-y-8">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3F5F9A]/10 border border-[#3F5F9A]/20 text-[#3F5F9A] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Mahasiswa Pecinta Alam
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Mapping Nature <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F5F9A] to-[#60a5fa]">
                  With Data.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Mahasiswa Pecinta Alam Balwana. Menggabungkan eksplorasi alam
                liar dengan teknologi Sistem Informasi Geografis (GIS) untuk
                konservasi yang terukur.
              </p>
            </Reveal>

            {/* PENGGANTI TOMBOL: STATS ROW */}
            <Reveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-8 pt-4 border-t border-gray-200/60 max-w-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3F5F9A]/5 flex items-center justify-center text-[#3F5F9A]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">50+</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Anggota Aktif
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3F5F9A]/5 flex items-center justify-center text-[#3F5F9A]">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100+</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Peta Digital
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3F5F9A]/5 flex items-center justify-center text-[#3F5F9A]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Divisi Teknis
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Stacked Cards (Interactive) */}
          <Reveal delay={0.4}>
            <div className="relative h-[500px] flex items-center justify-center perspective-1000">
              <div className="relative w-80 h-[450px]">
                {heroImages.map((img, index) => {
                  const position =
                    (index - activeCard + heroImages.length) %
                    heroImages.length;

                  // Logic style manual pengganti Framer Motion
                  let style = {
                    transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    position: "absolute",
                    inset: 0,
                    borderRadius: "2rem",
                    overflow: "hidden",
                    border: "4px solid white",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  };

                  if (position === 0) {
                    style = {
                      ...style,
                      transform: "scale(1) translate(0, 0)",
                      zIndex: 30,
                      opacity: 1,
                    };
                  } else if (position === 1) {
                    style = {
                      ...style,
                      transform: "scale(0.92) translate(30px, 30px)",
                      zIndex: 20,
                      opacity: 0.6,
                      filter: "grayscale(50%)",
                    };
                  } else {
                    style = {
                      ...style,
                      transform: "scale(0.85) translate(60px, 60px)",
                      zIndex: 10,
                      opacity: 0.3,
                      filter: "grayscale(100%)",
                    };
                  }

                  return (
                    <div
                      key={index}
                      onClick={position === 0 ? handleCardClick : undefined}
                      style={style}
                      className={position === 0 ? "cursor-pointer" : ""}
                    >
                      <img
                        src={img}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />
                      {position === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3F5F9A]/90 via-transparent to-transparent">
                          <div className="absolute bottom-8 left-8 text-white animate-float">
                            <p className="font-bold tracking-widest text-xs opacity-80 mb-1">
                              SEDERAP SATU ASA
                            </p>
                            <h3 className="text-3xl font-black">BALWANA</h3>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="tentang" className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative group">
              <div className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden relative shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                {/* Fallback icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#f2f5ff]">
                  <Users className="w-24 h-24 text-[#3F5F9A]/20" />
                </div>

                {/* Main Image */}
                <img
                  src={balwanaImage}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="About Balwana"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                {/* Overlay Halus */}
                <div className="absolute inset-0 bg-[#3F5F9A] mix-blend-multiply opacity-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              </div>
              {/* Decoration Dots */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 -z-10"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#3F5F9A]/5 rounded-full -z-10 animate-pulse-soft"></div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.2}>
              <span className="text-[#3F5F9A] font-bold uppercase tracking-wider text-sm bg-blue-50 px-3 py-1 rounded-full">
                Siapa Kami
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                Lebih Dari Sekedar <br />
                <span className="text-[#3F5F9A]">Komunitas Pendaki</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Mapala Balwana adalah wadah pembentukan karakter yang
                berlandaskan pada kode etik pencinta alam. Kami tidak hanya
                menaklukkan puncak, tapi juga menaklukkan ego diri sendiri.
              </p>
            </Reveal>

            <div className="space-y-4 mb-8">
              {[
                "Pendidikan & Pelatihan Rutin",
                "Pengabdian Masyarakat",
                "Riset & Konservasi Lingkungan",
              ].map((item, i) => (
                <Reveal key={i} delay={0.3 + i * 0.1}>
                  <div className="flex items-center gap-4 text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#3F5F9A]/10 flex items-center justify-center text-[#3F5F9A] shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <a
                href="/tentang-kami"
                className="inline-flex items-center gap-2 text-[#3F5F9A] font-bold hover:text-blue-700 transition-colors group"
              >
                Baca Sejarah Lengkap{" "}
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- PRODUK DIGITAL --- */}
      <section className="py-24 bg-[#f9fafe]">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Reveal>
              <h2 className="text-3xl font-bold text-[#3F5F9A] mb-4">
                Ekosistem Digital
              </h2>
              <p className="text-gray-600 text-lg">
                Platform teknologi yang dikembangkan oleh anggota Balwana untuk
                mendukung kegiatan alam bebas dan manajemen organisasi.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produkItems.map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group h-full flex flex-col">
                  <div className="w-14 h-14 bg-[#3F5F9A]/10 rounded-2xl flex items-center justify-center text-[#3F5F9A] mb-6 group-hover:bg-[#3F5F9A] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-[#3F5F9A] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>
                  <div className="flex items-center text-sm font-bold text-[#3F5F9A] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- DIVISI --- */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Divisi
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mt-4">
                Tiga pilar utama kemampuan teknis lapangan anggota Balwana.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {divisiItems.map((div, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                  {/* Fake Image Background (Gradient & Pattern) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3F5F9A] to-[#1e3a8a] group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#3F5F9A] transition-all duration-300">
                      {div.icon}
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {div.name}
                      </h3>
                      <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                        <p className="text-blue-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                          {div.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- BERITA --- */}
      <section className="py-24 bg-[#f9fafe]">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <Reveal>
              <h2 className="text-3xl font-bold text-[#3F5F9A]">
                Berita Terbaru
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href="/portalberita"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#3F5F9A] transition-colors"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((news, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group hover:-translate-y-1">
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#3F5F9A] shadow-sm">
                      {news.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{news.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>Admin</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-[#3F5F9A] transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h3>
                    <a
                      href="/portalberita"
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#3F5F9A] group/link"
                    >
                      Baca Selengkapnya{" "}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALERI --- */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-3xl font-bold text-[#3F5F9A]">Dokumentasi</h2>
              <p className="text-gray-500 mt-2">
                Momen-momen terbaik kami di alam bebas.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px] md:h-[600px]">
            {galleryItems.map((src, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className={`rounded-2xl overflow-hidden relative group h-full w-full cursor-pointer ${
                    i === 0 ? "col-span-2 row-span-2" : "col-span-1"
                  }`}
                >
                  <img
                    src={src}
                    alt="Galeri"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs font-bold uppercase tracking-wider">
                        Galeri
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
