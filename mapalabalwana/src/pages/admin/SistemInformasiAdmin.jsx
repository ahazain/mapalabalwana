import React, { useState, useEffect } from "react";
import api from "../../services/Api";
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
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  upload: (
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  ),
};

const docTypes = ["Seminar", "Ekspedisi", "Internal", "Diklat"];

/* --- 3. MAIN COMPONENT --- */
const SistemInformasiAdmin = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileInputType, setFileInputType] = useState("url"); // 'url' | 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type: "Internal",
    authorName: "", // Disesuaikan dengan backend
    authorNia: "", // Disesuaikan dengan backend
    date: new Date().toISOString().split("T")[0],
    tags: "",
    summary: "",
    fileType: "FILE",
    size: "",
    fileUrl: "",
  });

  // 1. FETCH DATA
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.getDocuments();
      if (response.data.status) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter Logic
  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.authorName.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  // 2. DELETE DATA
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus dokumen ini?")) {
      try {
        await api.deleteDocument(id);
        fetchDocuments();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus dokumen.");
      }
    }
  };

  // Handlers Modal
  const handleEdit = (item) => {
    setFormData({
      ...item,
      // Format ulang tags array ke string comma-separated
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
  };

  const handleAdd = () => {
    setFormData({
      id: "", // Backend handle ID generation
      title: "",
      type: "Internal",
      authorName: "",
      authorNia: "",
      date: new Date().toISOString().split("T")[0],
      tags: "",
      summary: "",
      fileType: "FILE",
      size: "",
      fileUrl: "",
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
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const type = file.name.split(".").pop().toUpperCase();
      const objectUrl = URL.createObjectURL(file);

      setFormData({
        ...formData,
        fileUrl: objectUrl,
        size: sizeMB,
        fileType: type,
      });
    }
  };

  // 3. SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("type", formData.type);
    submitData.append("summary", formData.summary);
    submitData.append("authorName", formData.authorName);
    submitData.append("authorNia", formData.authorNia);
    submitData.append("date", formData.date);
    submitData.append("tags", formData.tags);

    // File Handling
    if (fileInputType === "file" && selectedFile) {
      submitData.append("file", selectedFile); // Key 'file' sesuai backend
    } else if (formData.fileUrl) {
      // Jika mode URL atau edit tanpa ganti file (Logic backend menyesuaikan)
      // Jika backend mengharuskan file fisik, maka mode URL hanya untuk edit existing
      // Untuk kasus ini kita asumsikan backend handle skip file jika edit
    }

    try {
      if (isEditing) {
        await api.updateDocument(formData.id, submitData);
      } else {
        await api.createDocument(submitData);
      }
      setIsModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error saving document:", error);
      alert(error.response?.data?.message || "Gagal menyimpan dokumen.");
    }
  };

  // Helper URL
  const getFileUrl = (path) => {
    if (!path) return "#";
    return path.startsWith("http") ? path : `${IMAGE_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-4 md:p-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sistem Informasi
          </h1>
          <p className="text-slate-500 text-sm">
            Kelola repositori dokumen, jurnal, dan laporan kegiatan.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Icon path={icons.plus} className="w-5 h-5" />
          Upload Dokumen
        </button>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari judul, ID, atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {loading ? "Memuat..." : `Total: ${filteredData.length} Dokumen`}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 border-b border-slate-100 w-24">ID</th>
                <th className="p-4 border-b border-slate-100">Judul Dokumen</th>
                <th className="p-4 border-b border-slate-100">Tipe</th>
                <th className="p-4 border-b border-slate-100">Penulis (NIA)</th>
                <th className="p-4 border-b border-slate-100">Tanggal</th>
                <th className="p-4 border-b border-slate-100">File</th>
                <th className="p-4 border-b border-slate-100 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading Data...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {item.id}
                    </td>
                    <td
                      className="p-4 font-medium text-slate-800 max-w-xs truncate"
                      title={item.title}
                    >
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          item.type === "Seminar"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : item.type === "Ekspedisi"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : item.type === "Diklat"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700">{item.authorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.authorNia}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold uppercase bg-slate-100 px-1 rounded border border-slate-200">
                          {item.fileType || "FILE"}
                        </span>
                        <span>{item.fileSize || "-"}</span>
                        {item.fileUrl && (
                          <a
                            href={getFileUrl(item.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#3F5F9A] hover:underline"
                          >
                            <Icon path={icons.download} className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Icon path={icons.edit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Icon path={icons.trash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Icon
                          path={icons.search}
                          className="w-6 h-6 text-slate-300"
                        />
                      </div>
                      <p>Dokumen tidak ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-end items-center gap-2">
          <button
            className="p-2 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50"
            disabled
          >
            <Icon path={icons.chevronLeft} className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500">Halaman 1 dari 1</span>
          <button
            className="p-2 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50"
            disabled
          >
            <Icon path={icons.chevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon
                  path={icons.database}
                  className="w-5 h-5 text-[#3F5F9A]"
                />
                {isEditing ? "Edit Dokumen" : "Upload Dokumen Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon path={icons.x} className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="docForm" onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Title & Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Judul Dokumen
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      placeholder="Contoh: Laporan Pertanggungjawaban..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipe Dokumen
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                    >
                      {docTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nama Penulis
                    </label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) =>
                        setFormData({ ...formData, authorName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      NIA (Nomor Anggota)
                    </label>
                    <input
                      type="text"
                      value={formData.authorNia}
                      onChange={(e) =>
                        setFormData({ ...formData, authorNia: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      placeholder="B.XX.XXX.XX"
                    />
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Dokumen (PDF/Office)
                  </label>

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

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                      {fileInputType === "url" ? (
                        <input
                          type="text"
                          placeholder="https://drive.google.com/..."
                          value={formData.fileUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fileUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm"
                        />
                      ) : (
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}
                    </div>
                    {/* File Info Badge */}
                    {formData.size && (
                      <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                        <div className="bg-red-50 text-red-600 p-1 rounded text-xs font-bold uppercase">
                          {formData.fileType}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formData.size}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary & Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ringkasan / Abstrak
                  </label>
                  <textarea
                    rows="4"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm resize-none"
                    placeholder="Deskripsi singkat mengenai isi dokumen..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                    placeholder="Contoh: Rapat, Bulanan, 2025"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="docForm"
                className="px-6 py-2 text-white bg-[#3F5F9A] hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-md"
              >
                Simpan Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemInformasiAdmin;
