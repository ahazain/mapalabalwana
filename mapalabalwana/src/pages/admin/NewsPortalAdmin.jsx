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
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
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
  tag: (
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  ),
};

const categories = [
  "Ekspedisi",
  "Konservasi",
  "Rock Climbing",
  "Pelatihan",
  "Edukasi",
  "Event",
  "Lainnya",
];

/* --- 3. MAIN COMPONENT --- */
const NewsPortalAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileInputType, setFileInputType] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    excerpt: "",
    content: "",
    category: "Ekspedisi",
    author: "",
    date: new Date().toISOString().split("T")[0],
    readTime: "5 min",
    image: "",
    status: "Draft",
    tags: "",
  });

  // 1. FETCH DATA
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.getArticles();
      if (response.data.status) {
        setArticles(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil berita:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter Logic
  const filteredArticles = articles.filter((item) => {
    // Safe author name check
    const authorName = item.author?.name || "";
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      authorName.toLowerCase().includes(searchLower)
    );
  });

  // 2. DELETE DATA
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await api.deleteArticle(id);
        fetchArticles();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus berita.");
      }
    }
  };

  // Handlers Modal
  const handleEdit = (item) => {
    setFormData({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
      image: item.image || "",
      // Safe author extraction for form
      author: item.author?.name || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      title: "",
      excerpt: "",
      content: "",
      category: "Ekspedisi",
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
      readTime: "5 min",
      image: "",
      status: "Draft",
      tags: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: objectUrl });
    }
  };

  // 3. SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("excerpt", formData.excerpt);
    submitData.append("content", formData.content);
    submitData.append("category", formData.category);
    submitData.append("author", formData.author);
    submitData.append("date", formData.date);
    submitData.append("readTime", formData.readTime);
    submitData.append("status", formData.status);
    submitData.append("tags", formData.tags);

    if (fileInputType === "file" && selectedFile) {
      submitData.append("image", selectedFile);
    } else {
      submitData.append("image", formData.image);
    }

    try {
      if (isEditing) {
        await api.updateArticle(formData.id, submitData);
      } else {
        await api.createArticle(submitData);
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (error) {
      console.error("Gagal menyimpan berita:", error);
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") || url.startsWith("blob")
      ? url
      : `${IMAGE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Icon path={icons.fileText} className="w-7 h-7 text-[#3F5F9A]" />
            Manajemen Berita
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola artikel, publikasi, dan update kegiatan.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Icon path={icons.plus} className="w-5 h-5" />
          Tulis Berita
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari judul atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {loading
              ? "Memuat..."
              : `Total: ${filteredArticles.length} Artikel`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 border-b border-slate-100 w-20">Cover</th>
                <th className="p-4 border-b border-slate-100">
                  Judul & Ringkasan
                </th>
                <th className="p-4 border-b border-slate-100">Kategori</th>
                <th className="p-4 border-b border-slate-100">Info</th>
                <th className="p-4 border-b border-slate-100">Status</th>
                <th className="p-4 border-b border-slate-100 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Loading Data...
                  </td>
                </tr>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-14 h-10 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={getImageUrl(item.image)}
                          alt="Cover"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Img";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-slate-800 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.excerpt}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1 text-xs">
                        <Icon path={icons.user} className="w-3 h-3" />
                        {/* FIX UTAMA DISINI: Hanya render string, tidak boleh object */}
                        {item.author?.name || "Admin"}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Icon path={icons.calendar} className="w-3 h-3" />{" "}
                        {new Date(
                          item.createdAt || item.date
                        ).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          item.status === "PUBLISHED" ||
                          item.status === "Published"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Icon path={icons.edit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Icon path={icons.trash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Belum ada berita.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination omitted for brevity */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon
                  path={icons.fileText}
                  className="w-5 h-5 text-[#3F5F9A]"
                />
                {isEditing ? "Edit Berita" : "Tulis Berita Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon path={icons.x} className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form id="newsForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Judul Berita
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] font-bold text-slate-800"
                        placeholder="Judul yang menarik..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Ringkasan (Excerpt)
                      </label>
                      <textarea
                        rows="2"
                        required
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] resize-none text-sm"
                        placeholder="Ringkasan singkat..."
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gambar Sampul
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex bg-white border border-slate-200 rounded-lg mb-3 p-1 w-fit">
                        <button
                          type="button"
                          onClick={() => setFileInputType("url")}
                          className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                            fileInputType === "url"
                              ? "bg-[#3F5F9A] text-white shadow-sm"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          Link URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setFileInputType("file")}
                          className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                            fileInputType === "file"
                              ? "bg-[#3F5F9A] text-white shadow-sm"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          Upload File
                        </button>
                      </div>
                      {fileInputType === "url" ? (
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                        />
                      )}
                    </div>
                    <div className="w-full md:w-40 h-24 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={getImageUrl(formData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Konten Berita
                  </label>
                  <textarea
                    rows="8"
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm"
                    placeholder="Tuliskan isi berita..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tags (Pisahkan koma)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icon path={icons.tag} className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="Contoh: Konservasi, Hutan"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                form="newsForm"
                className="px-6 py-2 text-white bg-[#3F5F9A] rounded-lg shadow-md"
              >
                {isEditing ? "Update" : "Terbitkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPortalAdmin;
