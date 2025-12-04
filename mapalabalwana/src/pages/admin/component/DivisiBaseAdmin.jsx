import React, { useState, useEffect, useCallback } from "react";
import api from "../../../services/Api";
import { IMAGE_URL } from "../../../services/Config";

/* --- ICONS --- */
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
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  ),
  trash: (
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />,
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
};

const iconOptions = [
  "activity",
  "compass",
  "shield",
  "lifebuoy",
  "map",
  "tree",
  "leaf",
  "anchor",
];

const DivisiBaseAdmin = ({ divisionName, divisionIcon }) => {
  const [activeTab, setActiveTab] = useState("materi");
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputType, setFileInputType] = useState("url");

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    desc: "",
    iconName: "activity",
    image: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let result = [];
      if (activeTab === "materi") {
        const response = await api.getDocuments();
        if (response.data.status) {
          result = response.data.data.filter(
            (d) => d.type === "Materi" && d.tags.includes(divisionName)
          );
          result = result.map((d) => ({
            id: d.id,
            title: d.title,
            desc: d.summary,
            iconName: d.authorName || "activity",
            date: d.date,
            image: null,
          }));
        }
      } else {
        const response = await api.getGalleries();
        if (response.data.status) {
          result = response.data.data.filter(
            (g) => g.category === divisionName
          );
          result = result.map((g) => ({
            id: g.id,
            title: g.title,
            desc: g.description,
            image: g.imageUrl,
            date: g.createdAt,
            iconName: null,
          }));
        }
      }
      setDataList(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, divisionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setFormData({
      id: null,
      title: "",
      desc: "",
      iconName: "activity",
      image: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      title: item.title,
      desc: item.desc,
      iconName: item.iconName || "activity",
      image: item.image || "",
      date: new Date(item.date).toISOString().split("T")[0],
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data ini?")) return;
    try {
      if (activeTab === "materi") await api.deleteDocument(id);
      else await api.deleteGallery(id);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  // --- SUBMIT HANDLER (FIXED) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("date", formData.date);

    try {
      if (activeTab === "materi") {
        submitData.append("type", "Materi");
        submitData.append("summary", formData.desc);
        submitData.append("tags", divisionName);
        submitData.append("authorName", formData.iconName);
        submitData.append("authorNia", "-");

        if (selectedFile) {
          submitData.append("file", selectedFile);
        }

        if (isEditing) {
          await api.updateDocument(formData.id, submitData);
        } else {
          await api.createDocument(submitData);
        }
      } else {
        // --- LOGIC GALERI ---
        submitData.append("category", divisionName);
        submitData.append("description", formData.desc);

        if (fileInputType === "file" && selectedFile) {
          submitData.append("image", selectedFile);
        } else {
          submitData.append("image", formData.image);
        }

        // FIXED: Sekarang memanggil updateGallery jika sedang edit
        if (isEditing) {
          await api.updateGallery(formData.id, submitData);
        } else {
          await api.createGallery(submitData);
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error submit:", err);
      alert("Gagal menyimpan. " + (err.response?.data?.message || err.message));
    }
  };

  const getImageUrl = (url) =>
    url && (url.startsWith("http") || url.startsWith("blob"))
      ? url
      : `${IMAGE_URL}${url}`;

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {divisionIcon} Divisi {divisionName}
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola materi dan galeri kegiatan divisi.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Icon path={icons.plus} className="w-4 h-4" /> Tambah Data
        </button>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("materi")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "materi"
                ? "text-[#3F5F9A] border-b-2 border-[#3F5F9A] bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon path={icons.book} className="w-4 h-4" /> Materi Kurikulum
          </button>
          <button
            onClick={() => setActiveTab("galeri")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "galeri"
                ? "text-[#3F5F9A] border-b-2 border-[#3F5F9A] bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon path={icons.camera} className="w-4 h-4" /> Galeri Foto
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center text-slate-400 py-10">Loading...</div>
          ) : dataList.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              Belum ada data.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataList.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:shadow-md transition-all flex flex-col"
                >
                  {activeTab === "galeri" && (
                    <div className="h-40 rounded-lg overflow-hidden mb-3 bg-slate-200">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    {activeTab === "materi" && (
                      <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center text-[#3F5F9A] font-bold uppercase text-xs">
                        {item.iconName ? item.iconName.slice(0, 2) : "MA"}
                      </div>
                    )}
                    <div className="flex-1 ml-3">
                      <h4 className="font-bold text-slate-800 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {new Date(item.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {item.desc}
                  </p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 text-xs font-bold px-2 py-1 rounded hover:bg-blue-100"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 text-xs font-bold px-2 py-1 rounded hover:bg-red-100"
                    >
                      HAPUS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative z-10">
            <div className="flex justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? "Edit" : "Tambah"}{" "}
                {activeTab === "materi" ? "Materi" : "Foto"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400"
              >
                <Icon path={icons.x} className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Judul
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {activeTab === "materi" ? (
                <>
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Ikon
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={formData.iconName}
                      onChange={(e) =>
                        setFormData({ ...formData, iconName: e.target.value })
                      }
                    >
                      {iconOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Foto Galeri
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setFileInputType("url")}
                      className={`text-xs px-2 py-1 rounded ${
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
                      className={`text-xs px-2 py-1 rounded ${
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
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      type="file"
                      className="text-sm"
                      onChange={handleFileChange}
                    />
                  )}
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3F5F9A] text-white rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisiBaseAdmin;
