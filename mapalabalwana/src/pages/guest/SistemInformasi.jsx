import React, { useState, useEffect } from "react";
import api from "../../services/Api";
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
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />,
  bookOpen: (
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  tag: (
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  map: (
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  ),
};

/* --- 2. MAIN COMPONENT --- */

const SistemInformasiPage = () => {
  const [documents, setDocuments] = useState([]); // Data asli dari API
  const [filteredData, setFilteredData] = useState([]); // Data hasil filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, contributors: 0 });

  const categories = ["Semua", "Seminar", "Ekspedisi", "Internal", "Diklat"];

  // 1. FETCH DATA
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await api.getDocuments();
        if (response.data.status) {
          const docs = response.data.data;
          setDocuments(docs);
          setFilteredData(docs);

          // Hitung statistik sederhana
          const uniqueAuthors = new Set(docs.map((d) => d.authorName)).size;
          setStats({ total: docs.length, contributors: uniqueAuthors });
        }
      } catch (error) {
        console.error("Gagal mengambil dokumen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // 2. FILTER LOGIC
  useEffect(() => {
    let result = documents;

    if (selectedType !== "Semua") {
      result = result.filter((item) => item.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.authorName && item.authorName.toLowerCase().includes(query)) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          (item.id && item.id.toLowerCase().includes(query))
      );
    }

    setFilteredData(result);
  }, [searchQuery, selectedType, documents]);

  // Helper URL File
  const getFileUrl = (path) => {
    if (!path) return "#";
    return path.startsWith("http") ? path : `${IMAGE_URL}${path}`;
  };

  // Helper Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800">
      {/* --- HEADER DASHBOARD STYLE --- */}
      <header className="bg-white border-b border-slate-200 pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#3F5F9A] mb-2">
                <Icon path={icons.database} className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase">
                  Balwana Knowledge Base
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Sistem Informasi Internal
              </h1>
              <p className="text-slate-500 mt-2 max-w-2xl">
                Repositori terpusat untuk arsip kegiatan, laporan seminar,
                jurnal ekspedisi, dan dokumen organisasi Mapala Balwana.
              </p>
            </div>

            {/* Stats Widget */}
            <div className="flex gap-4">
              <div className="bg-[#3F5F9A]/5 p-4 rounded-xl border border-[#3F5F9A]/10 min-w-[120px]">
                <div className="flex items-center gap-2 text-[#3F5F9A] mb-1">
                  <Icon path={icons.bookOpen} className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">
                    Total Dokumen
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-800">
                  {stats.total}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 min-w-[120px]">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Icon path={icons.award} className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">
                    Kontributor
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-800">
                  {stats.contributors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3F5F9A] transition-colors">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/20 focus:border-[#3F5F9A] transition-all text-sm"
              placeholder="Cari dokumen, penulis, atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  selectedType === cat
                    ? "bg-[#3F5F9A] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid / List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-[#3F5F9A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Memuat data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-[#3F5F9A]/50 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                {/* Decorative Left Border */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    item.type === "Seminar"
                      ? "bg-blue-500"
                      : item.type === "Ekspedisi"
                      ? "bg-emerald-500"
                      : item.type === "Diklat"
                      ? "bg-orange-500"
                      : "bg-slate-500"
                  }`}
                ></div>

                {/* Icon & Type */}
                <div className="flex-shrink-0 flex md:flex-col items-center gap-3 md:w-32 md:border-r border-slate-100 md:pr-6">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.type === "Seminar"
                        ? "bg-blue-50 text-blue-600"
                        : item.type === "Ekspedisi"
                        ? "bg-emerald-50 text-emerald-600"
                        : item.type === "Diklat"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon
                      path={
                        item.type === "Seminar"
                          ? icons.briefcase
                          : item.type === "Ekspedisi"
                          ? icons.map
                          : item.type === "Diklat"
                          ? icons.award
                          : icons.fileText
                      }
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="text-center">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        item.type === "Seminar"
                          ? "bg-blue-100 text-blue-700"
                          : item.type === "Ekspedisi"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.type === "Diklat"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#3F5F9A] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 hidden sm:block">
                      {item.id}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.summary}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <Icon
                        path={icons.user}
                        className="w-3.5 h-3.5 text-[#3F5F9A]"
                      />
                      <span className="font-medium text-slate-700">
                        {item.authorName}
                      </span>
                      {item.authorNia && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="font-mono text-[10px]">
                            {item.authorNia}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon path={icons.calendar} className="w-3.5 h-3.5" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.tags &&
                        item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[#3F5F9A] bg-[#3F5F9A]/5 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex md:flex-col justify-center items-end pl-0 md:pl-4 border-l-0 md:border-l border-slate-100 gap-2">
                  <a
                    href={getFileUrl(item.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3F5F9A] text-[#3F5F9A] rounded-lg text-sm font-medium hover:bg-[#3F5F9A] hover:text-white transition-all w-full md:w-auto justify-center group/btn shadow-sm"
                  >
                    <Icon path={icons.download} className="w-4 h-4" />
                    <span className="hidden md:inline">Akses</span>
                    <span className="md:hidden">Buka</span>
                  </a>
                  <span className="text-[10px] text-slate-400 font-mono text-center w-full block">
                    {item.fileType} • {item.fileSize || "-"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Icon path={icons.search} className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                Tidak ada dokumen ditemukan
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Coba ubah kata kunci pencarian atau filter kategori.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SistemInformasiPage;
