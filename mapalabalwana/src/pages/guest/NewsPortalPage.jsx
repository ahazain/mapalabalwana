import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  newspaper: (
    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-2.5-2.5H15" />
  ),
};

/* --- 2. MAIN COMPONENT --- */

const NewsPortalPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.getArticles();
        if (response.data.status) {
          const fetchedArticles = response.data.data;
          setArticles(fetchedArticles);
          setFilteredArticles(fetchedArticles);

          // Extract unique categories dynamically
          const uniqueCats = [
            "Semua",
            ...new Set(fetchedArticles.map((a) => a.category)),
          ];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = articles;

    // Filter by Category
    if (selectedCategory !== "Semua") {
      result = result.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          (article.author?.name || "").toLowerCase().includes(query)
      );
    }

    setFilteredArticles(result);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [selectedCategory, searchQuery, articles]);

  // 3. Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/800x600?text=No+Image";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  // Featured Articles (Ambil 3 berita terbaru)
  const featuredArticles = articles.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3F5F9A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-[#3F5F9A] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <Icon path={icons.newspaper} className="w-4 h-4" />
            Balwana Newsroom
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Berita Seputar Pecinta Alam <br />
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Dokumentasi digital kegiatan ekspedisi, konservasi alam, dan wawasan
            lingkungan terbaru dari Mapala Balwana.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-20">
        {/* Search & Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-16">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3F5F9A] transition-colors">
                <Icon path={icons.search} className="w-5 h-5" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] transition-all"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
                <Icon path={icons.filter} className="w-4 h-4" />
                <span>Filter:</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#3F5F9A] text-white shadow-md shadow-blue-900/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Section (Hanya muncul jika tidak sedang search/filter) */}
        {!searchQuery &&
          selectedCategory === "Semua" &&
          currentPage === 1 &&
          featuredArticles.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-[#3F5F9A] pl-4">
                  Berita Unggulan
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Featured (Left) */}
                <Link
                  to={`/berita/${featuredArticles[0].id}`}
                  className="lg:col-span-2 group cursor-pointer relative rounded-2xl overflow-hidden shadow-lg h-[400px]"
                >
                  <img
                    src={getImageUrl(featuredArticles[0].image)}
                    alt={featuredArticles[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x600?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="bg-[#3F5F9A] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                      {featuredArticles[0].category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                      {featuredArticles[0].title}
                    </h3>
                    <div className="flex items-center gap-4 text-slate-300 text-sm">
                      <span className="flex items-center gap-1">
                        <Icon path={icons.user} className="w-4 h-4" />{" "}
                        {featuredArticles[0].author?.name || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon path={icons.calendar} className="w-4 h-4" />{" "}
                        {formatDate(
                          featuredArticles[0].date ||
                            featuredArticles[0].createdAt
                        )}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Sub Featured (Right Stack) */}
                <div className="flex flex-col gap-8 h-[400px]">
                  {featuredArticles.slice(1, 3).map((article) => (
                    <Link
                      key={article.id}
                      to={`/berita/${article.id}`}
                      className="flex-1 relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                    >
                      <img
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5">
                        <span className="text-xs font-bold text-blue-300 mb-1 block uppercase tracking-wider">
                          {article.category}
                        </span>
                        <h3 className="text-lg font-bold text-white leading-snug group-hover:underline decoration-[#3F5F9A] decoration-2 underline-offset-4">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* All Articles Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-[#3F5F9A] pl-4">
              {searchQuery
                ? `Hasil Pencarian: "${searchQuery}"`
                : "Artikel Terbaru"}
            </h2>
            <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#3F5F9A] text-xs font-bold rounded-full shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Icon path={icons.calendar} className="w-3 h-3" />{" "}
                        {formatDate(article.date || article.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Icon path={icons.clock} className="w-3 h-3" />{" "}
                        {article.readTime || "5 min"}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:text-[#3F5F9A] transition-colors">
                      <Link to={`/berita/${article.id}`}>{article.title}</Link>
                    </h3>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <Icon path={icons.user} className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {article.author?.name || "Admin"}
                        </span>
                      </div>
                      <Link
                        to={`/berita/${article.id}`}
                        className="text-[#3F5F9A] font-semibold text-sm flex items-center gap-1 group/link"
                      >
                        Baca{" "}
                        <Icon
                          path={icons.arrowRight}
                          className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <h3 className="text-lg font-bold text-slate-600">
                Belum ada berita
              </h3>
              <p className="text-slate-400">Silakan kembali lagi nanti.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#3F5F9A]"
                }`}
              >
                <Icon path={icons.chevronLeft} className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === number
                        ? "bg-[#3F5F9A] text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#3F5F9A]"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#3F5F9A]"
                }`}
              >
                <Icon path={icons.chevronRight} className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPortalPage;
