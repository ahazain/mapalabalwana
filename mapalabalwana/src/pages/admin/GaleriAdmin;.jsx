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
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  upload: (
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  ),
};

const categories = [
  "Semua",
  "Gunung Hutan",
  "Konservasi",
  "Rock Climbing",
  "Diklat",
  "Kegiatan Umum",
];

/* --- 2. MAIN COMPONENT --- */
const GaleriAdmin = () => {
  const [galleries, setGalleries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileInputType, setFileInputType] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan Umum",
    description: "",
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
  });

  // 1. FETCH DATA
  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await api.getGalleries();
      if (response.data.status) {
        setGalleries(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil galeri:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Filter Logic
  const filteredGalleries = galleries.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // 2. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus foto ini?")) {
      try {
        await api.deleteGallery(id);
        fetchGalleries();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus foto.");
      }
    }
  };

  // Handlers
  const handleAdd = () => {
    setFormData({
      title: "",
      category: "Kegiatan Umum",
      description: "",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("category", formData.category);
    submitData.append("description", formData.description);
    submitData.append("date", formData.date);

    if (fileInputType === "file" && selectedFile) {
      submitData.append("image", selectedFile);
    } else {
      submitData.append("image", formData.imageUrl);
    }

    try {
      await api.createGallery(submitData);
      setIsModalOpen(false);
      fetchGalleries();
    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal mengupload foto.");
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Icon path={icons.camera} className="w-7 h-7 text-[#3F5F9A]" />
            Galeri & Dokumentasi
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola foto kegiatan dan dokumentasi lapangan.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Icon path={icons.plus} className="w-5 h-5" />
          Upload Foto
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Categories Tab */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#3F5F9A] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon path={icons.search} className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari judul foto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#3F5F9A] text-sm"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-400">
            Memuat galeri...
          </div>
        ) : filteredGalleries.length > 0 ? (
          filteredGalleries.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300?text=Err";
                  }}
                />
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-transform"
                    title="Hapus Foto"
                  >
                    <Icon path={icons.trash} className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-slate-800 text-sm truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {item.description || "Tanpa deskripsi"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Icon path={icons.image} className="w-8 h-8" />
            </div>
            <p className="text-slate-500">Belum ada foto di kategori ini.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon path={icons.upload} className="w-5 h-5 text-[#3F5F9A]" />
                Upload Foto Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon path={icons.x} className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form
                id="galeriForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#3F5F9A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    >
                      {categories
                        .filter((c) => c !== "Semua")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Foto
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setFileInputType("url")}
                      className={`text-xs px-3 py-1.5 rounded ${
                        fileInputType === "url"
                          ? "bg-[#3F5F9A] text-white"
                          : "bg-white"
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileInputType("file")}
                      className={`text-xs px-3 py-1.5 rounded ${
                        fileInputType === "file"
                          ? "bg-[#3F5F9A] text-white"
                          : "bg-white"
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                  {fileInputType === "url" ? (
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                    />
                  )}
                  {formData.imageUrl && (
                    <div className="mt-3 h-32 bg-white rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      <img
                        src={formData.imageUrl}
                        className="h-full object-cover"
                        alt="preview"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 outline-none resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                form="galeriForm"
                className="px-6 py-2 bg-[#3F5F9A] text-white rounded-lg hover:bg-blue-700 shadow-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriAdmin;
