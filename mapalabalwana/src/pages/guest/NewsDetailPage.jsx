import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  twitter: (
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
};

/* --- 2. MAIN COMPONENT --- */

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ambil Detail Artikel berdasarkan ID
        const response = await api.getArticleById(id);

        if (response.data.status) {
          const currentArticle = response.data.data;
          setArticle(currentArticle);

          // 2. Ambil Artikel Lain untuk "Berita Terkait"
          // Kita fetch semua artikel, lalu filter yang kategorinya sama tapi ID-nya beda
          const allArticlesResponse = await api.getArticles();
          if (allArticlesResponse.data.status) {
            const others = allArticlesResponse.data.data.filter(
              (item) =>
                item.category === currentArticle.category &&
                item.id !== currentArticle.id
            );
            // Ambil maksimal 2 berita terkait
            setRelatedArticles(others.slice(0, 2));
          }
        }
      } catch (error) {
        console.error("Error fetching article detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
    // Reset scroll ke atas saat pindah artikel
    window.scrollTo(0, 0);
  }, [id]);

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/1200x600?text=No+Image";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  const handleShare = (platform) => {
    alert(`Berita dibagikan ke ${platform} (Simulasi)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3F5F9A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f9fafe] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-500">
          <Icon path={icons.fileText} className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          Artikel Tidak Ditemukan
        </h2>
        <Link
          to="/portalberita"
          className="mt-4 px-6 py-2 bg-[#3F5F9A] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Portal Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 pb-20">
      {/* --- HERO IMAGE (FULL WIDTH) --- */}
      <div className="relative h-[60vh] w-full overflow-hidden group">
        <div className="absolute inset-0 bg-slate-900/50 z-10 transition-opacity group-hover:bg-slate-900/40"></div>
        <img
          src={getImageUrl(article.image)}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />

        {/* Back Button */}
        <div className="absolute top-24 left-6 z-20">
          <Link
            to="/portalberita"
            className="inline-flex items-center px-4 py-2 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-black/40 transition-all font-medium text-sm"
          >
            <Icon path={icons.arrowLeft} className="w-4 h-4 mr-2" />
            Kembali
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pt-32">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <span className="inline-block px-3 py-1 bg-[#3F5F9A] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg shadow-blue-900/50">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-200 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <Icon path={icons.user} className="w-4 h-4" />
                </div>
                {article.author?.name || "Admin Balwana"}
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  path={icons.calendar}
                  className="w-4 h-4 text-[#3F5F9A]"
                />
                {formatDate(article.date || article.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Icon path={icons.clock} className="w-4 h-4 text-[#3F5F9A]" />
                {article.readTime || "5 min read"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white rounded-t-3xl shadow-2xl p-8 md:p-12 min-h-[50vh]">
          <div className="flex flex-col md:flex-row gap-12 relative">
            {/* Sticky Sidebar Actions (Left) */}
            <div className="hidden md:flex flex-col gap-4 sticky top-24 h-fit w-16 flex-shrink-0">
              <button
                onClick={() => setLiked(!liked)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                  liked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-200 hover:shadow-md"
                }`}
              >
                <Icon
                  path={icons.heart}
                  className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                  bookmarked
                    ? "bg-indigo-50 border-indigo-200 text-[#3F5F9A]"
                    : "bg-white border-slate-100 text-slate-400 hover:text-[#3F5F9A] hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                <Icon
                  path={icons.bookmark}
                  className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
                />
              </button>

              <div className="w-full h-px bg-slate-100 my-2"></div>

              <button
                onClick={() => handleShare("Facebook")}
                className="w-12 h-12 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Icon path={icons.facebook} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("Twitter")}
                className="w-12 h-12 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-sky-500 hover:border-sky-100 hover:bg-sky-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Icon path={icons.twitter} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("LinkedIn")}
                className="w-12 h-12 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-blue-700 hover:border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Icon path={icons.linkedin} className="w-5 h-5" />
              </button>
            </div>

            {/* Main Article Text */}
            <div className="flex-1">
              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl font-medium text-slate-600 mb-8 leading-relaxed border-l-4 border-[#3F5F9A] pl-6 italic">
                  "{article.excerpt}"
                </p>
              )}

              {/* Body Content */}
              <article className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose">
                {/* Render paragraphs dynamically */}
                {article.content ? (
                  article.content.split("\n").map(
                    (para, index) =>
                      para.trim() !== "" && (
                        <p key={index} className="mb-6 text-lg">
                          {para}
                        </p>
                      )
                  )
                ) : (
                  <p className="text-slate-400 italic">Tidak ada konten.</p>
                )}
              </article>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-[#3F5F9A] hover:text-white hover:border-[#3F5F9A] transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Box */}
              <div className="mt-16 p-8 bg-[#f9fafe] rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-100 text-center sm:text-left">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#3F5F9A] shadow-md border border-slate-100 flex-shrink-0">
                  <Icon path={icons.user} className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3F5F9A] uppercase tracking-widest mb-2">
                    Tentang Penulis
                  </p>
                  <h4 className="text-xl font-bold text-slate-800">
                    {article.author?.name || "Admin Balwana"}
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Anggota aktif Mapala Balwana yang berdedikasi dalam bidang{" "}
                    {article.category}. Tulisan ini dibuat untuk
                    mendokumentasikan kegiatan dan berbagi wawasan.
                  </p>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                      Baca Juga
                    </h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {relatedArticles.map((rel) => (
                      <Link
                        key={rel.id}
                        to={`/berita/${rel.id}`}
                        className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={getImageUrl(rel.image)}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur text-[#3F5F9A] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                              {rel.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-[#3F5F9A] transition-colors">
                            {rel.title}
                          </h4>
                          <div className="flex items-center text-xs text-slate-400 gap-2">
                            <Icon path={icons.calendar} className="w-3 h-3" />
                            {formatDate(rel.date || rel.createdAt)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-full px-8 py-4 flex items-center gap-8 z-50">
        <button
          onClick={() => setLiked(!liked)}
          className={`${liked ? "text-red-500" : "text-slate-400"}`}
        >
          <Icon
            path={icons.heart}
            className={`w-6 h-6 ${liked ? "fill-current" : ""}`}
          />
        </button>
        <div className="w-px h-6 bg-slate-200"></div>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`${bookmarked ? "text-[#3F5F9A]" : "text-slate-400"}`}
        >
          <Icon
            path={icons.bookmark}
            className={`w-6 h-6 ${bookmarked ? "fill-current" : ""}`}
          />
        </button>
        <div className="w-px h-6 bg-slate-200"></div>
        <button
          className="text-slate-400 hover:text-blue-500"
          onClick={() => handleShare("Mobile")}
        >
          <Icon path={icons.share} className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default NewsDetailPage;
