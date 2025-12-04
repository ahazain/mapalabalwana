import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { IMAGE_URL } from "../../services/config";

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
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  mountain: <path d="M5 12l5-5 4 4 6-6v13H5z" />,
  tree: (
    <path d="M12 2L8 8h8l-4-6zM10 8L6 14h12l-4-6M8 14l-4 6h16l-4-6M12 20v2" />
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  crown: <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />,
  // FIXED: Dibungkus dengan Fragment <>...</>
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
};

const divisionIcons = {
  "Gunung Hutan": icons.mountain,
  Konservasi: icons.tree,
  "Rock Climbing": icons.shield,
  "Ketua Umum": icons.crown,
  "Sekretaris Umum": icons.briefcase,
  "Bendahara Umum": icons.briefcase,
};

const divisionColors = {
  "Gunung Hutan": "text-emerald-600 bg-emerald-50 border-emerald-100",
  Konservasi: "text-lime-600 bg-lime-50 border-lime-100",
  "Rock Climbing": "text-slate-600 bg-slate-50 border-slate-200",
  "Ketua Umum": "text-purple-600 bg-purple-50 border-purple-100",
};

/* --- 3. MAIN COMPONENT --- */

const PengurusPage = () => {
  const [pengurusData, setPengurusData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2024-2025");
  const [selectedDivision, setSelectedDivision] = useState("Semua");
  const [loading, setLoading] = useState(true);

  // Fetch Data API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getMembers();
        if (response.data.status) {
          setPengurusData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate periods dynamically
  const generatePeriods = () => {
    const periods = [];
    for (let start = 2020; start <= 2025; start++) {
      const end = start + 1;
      periods.unshift(`${start}-${end}`);
    }
    return periods;
  };
  const periods = generatePeriods();

  // Divisi Filter Options
  const divisions = [
    "Semua",
    "Ketua Umum",
    "Sekretaris Umum",
    "Bendahara Umum",
    "Humas",
    "Diklat",
    "Perlengkapan",
    "Litbang",
    "Gunung Hutan",
    "Konservasi",
    "Rock Climbing",
  ];

  // Filter Logic
  const filteredData = pengurusData.filter((p) => {
    const matchPeriod = p.period === selectedPeriod;
    const matchDivision =
      selectedDivision === "Semua" || p.division === selectedDivision;
    return matchPeriod && matchDivision;
  });

  // Helper Image
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x400?text=User";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-[#3F5F9A] overflow-hidden pt-24 pb-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-6">
            <Icon path={icons.users} className="w-4 h-4" /> Struktur Organisasi
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Pengurus Balwana.
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Tim yang berdedikasi menjaga semangat petualangan, integritas
            organisasi, dan pelestarian alam di lingkungan kampus.
          </p>
        </div>
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wide text-sm">
            <Icon path={icons.filter} className="w-4 h-4" /> Filter Data
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Period */}
            <div className="relative w-full sm:w-48 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icon path={icons.calendar} className="w-4 h-4" />
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] cursor-pointer hover:bg-white transition-colors"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Icon path={icons.chevronDown} className="w-4 h-4" />
              </div>
            </div>
            {/* Division Filter */}
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icon path={icons.users} className="w-4 h-4" />
              </div>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] cursor-pointer hover:bg-white transition-colors"
              >
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Icon path={icons.chevronDown} className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TEAM GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Memuat data pengurus...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-slate-200">
                  {/* GRAYSCALE DEFAULT, COLOR ON HOVER */}
                  <img
                    src={getImageUrl(p.photo)}
                    alt={p.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3F5F9A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Social Icons */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {p.linkedin && (
                      <a
                        href={p.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white text-[#0077b5] rounded-full hover:scale-110 transition-transform shadow-lg"
                      >
                        <Icon path={icons.linkedin} className="w-5 h-5" />
                      </a>
                    )}
                    {p.instagram && (
                      <a
                        href={
                          p.instagram.startsWith("http")
                            ? p.instagram
                            : `https://instagram.com/${p.instagram.replace(
                                "@",
                                ""
                              )}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white text-[#E1306C] rounded-full hover:scale-110 transition-transform shadow-lg"
                      >
                        <Icon path={icons.instagram} className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1 relative">
                  <div
                    className={`absolute -top-5 right-6 px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white ${
                      divisionColors[p.division] ||
                      "text-gray-600 bg-gray-50 border-gray-200"
                    }`}
                  >
                    <Icon
                      path={divisionIcons[p.division] || icons.users}
                      className="w-4 h-4"
                    />
                    {p.division}
                  </div>
                  <div className="mb-4 pt-2">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#3F5F9A] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[#3F5F9A] font-medium text-sm">
                      {p.role === "Koordinator"
                        ? `Koordinator ${p.division}`
                        : p.role}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <div>
                      <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Jurusan
                      </span>
                      {p.major}
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Angkatan
                      </span>
                      {p.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Icon path={icons.users} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              Data tidak ditemukan
            </h3>
            <p className="text-slate-500">
              Coba ubah filter periode atau divisi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};  

export default PengurusPage;
