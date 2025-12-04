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
  map: (
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  ),
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
  mapPin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  externalLink: (
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  ),
  magic: (
    <>
      <path d="M2 21h20" />
      <path d="M5 12l14 0" />
      <path d="M9 5l6 0" />
      <path d="M5 9l2 -2" />
      <path d="M19 9l-2 -2" />
    </>
  ),
};

const categories = [
  "Administrasi",
  "Topografi",
  "Hidrologi",
  "Geologi",
  "Lainnya",
];

const ProdukGIS = () => {
  const [maps, setMaps] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileInputType, setFileInputType] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // State untuk pencarian lokasi otomatis
  const [locationSearch, setLocationSearch] = useState("");
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    descriptionText: "",
    category: "Administrasi",
    north: "",
    south: "",
    east: "",
    west: "",
    fileUrl: "",
    fileSize: "",
    fileType: "FILE",
  });

  const fetchMaps = async () => {
    setLoading(true);
    try {
      const response = await api.getMaps();
      if (response.data.status) {
        setMaps(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching maps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  const filteredMaps = maps.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const parseDescription = (desc) => {
    try {
      return JSON.parse(desc) || { text: "", bounds: {} };
    } catch {
      return { text: desc, bounds: {} };
    }
  };

  // --- FITUR: AUTO DETECT BOUNDS ---
  const handleAutoDetectBounds = async () => {
    if (!locationSearch)
      return alert("Masukkan nama lokasi dulu (Misal: Jember)");

    setIsSearchingLoc(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationSearch}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const loc = data[0];
        // Nominatim boundingbox: [south, north, west, east]
        const south = parseFloat(loc.boundingbox[0]);
        const north = parseFloat(loc.boundingbox[1]);
        const west = parseFloat(loc.boundingbox[2]);
        const east = parseFloat(loc.boundingbox[3]);

        setFormData((prev) => ({
          ...prev,
          north: north,
          south: south,
          east: east,
          west: west,
        }));
        alert(`Lokasi ditemukan: ${loc.display_name}`);
      } else {
        alert("Lokasi tidak ditemukan. Coba nama yang lebih spesifik.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data lokasi.");
    } finally {
      setIsSearchingLoc(false);
    }
  };

  const handleEdit = (item) => {
    const parsed = parseDescription(item.description);
    setFormData({
      ...item,
      descriptionText: parsed.text,
      north: parsed.bounds?.n || "",
      south: parsed.bounds?.s || "",
      east: parsed.bounds?.e || "",
      west: parsed.bounds?.w || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
    setLocationSearch("");
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      title: "",
      descriptionText: "",
      category: "Administrasi",
      north: "",
      south: "",
      east: "",
      west: "",
      fileUrl: "",
      fileSize: "",
      fileType: "FILE",
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setFileInputType("url");
    setSelectedFile(null);
    setLocationSearch("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({
        ...formData,
        fileUrl: URL.createObjectURL(file),
        fileType: file.name.split(".").pop().toUpperCase(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("category", formData.category);

    const descJSON = JSON.stringify({
      text: formData.descriptionText,
      bounds: {
        n: formData.north,
        s: formData.south,
        e: formData.east,
        w: formData.west,
      },
    });
    submitData.append("description", descJSON);

    submitData.append("latitude", 0);
    submitData.append("longitude", 0);

    if (fileInputType === "file" && selectedFile) {
      submitData.append("file", selectedFile);
    } else {
      submitData.append("fileUrl", formData.fileUrl);
    }

    try {
      if (isEditing) {
        await api.updateMap(formData.id, submitData);
      } else {
        await api.createMap(submitData);
      }
      setIsModalOpen(false);
      fetchMaps();
    } catch (error) {
      console.error("Error saving map:", error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus peta?")) {
      await api.deleteMap(id);
      fetchMaps();
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Icon path={icons.map} className="w-6 h-6 text-[#3F5F9A]" /> Manajemen
          Peta Digital
        </h1>
        <button
          onClick={handleAdd}
          className="bg-[#3F5F9A] text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-blue-700 transition"
        >
          <Icon path={icons.plus} className="w-4 h-4" /> Upload Peta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-72">
            <div className="absolute left-3 top-2.5 text-slate-400">
              <Icon path={icons.search} className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none focus:border-[#3F5F9A]"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {loading ? "Memuat..." : `Total: ${filteredMaps.length} Peta`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="p-4">File</th>
                <th className="p-4">Judul</th>
                <th className="p-4">Kategori</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    Loading Data...
                  </td>
                </tr>
              ) : filteredMaps.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    Belum ada data peta.
                  </td>
                </tr>
              ) : (
                filteredMaps.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 bg-blue-50 rounded text-blue-600 flex items-center justify-center font-bold text-xs">
                        {item.fileType}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        <Icon path={icons.edit} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600"
                      >
                        <Icon path={icons.trash} className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? "Edit Peta" : "Upload Peta"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <Icon path={icons.x} className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <form id="mapForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Judul
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kategori
                  </label>
                  {/* Use categories array here */}
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- AUTO SEARCH BOUNDS --- */}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <Icon path={icons.search} className="w-4 h-4" /> Otomatis
                    Cari Koordinat
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nama Lokasi (cth: Jember)"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAutoDetectBounds}
                      disabled={isSearchingLoc}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSearchingLoc ? "..." : "Cari"}
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-600">
                    *Menggunakan data OpenStreetMap. Pastikan nama lokasi
                    spesifik.
                  </p>
                </div>

                {/* MANUAL INPUTS (Terisi Otomatis) */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Utara (N)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.north}
                      onChange={(e) =>
                        setFormData({ ...formData, north: e.target.value })
                      }
                      className="w-full text-sm border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Selatan (S)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.south}
                      onChange={(e) =>
                        setFormData({ ...formData, south: e.target.value })
                      }
                      className="w-full text-sm border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Barat (W)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.west}
                      onChange={(e) =>
                        setFormData({ ...formData, west: e.target.value })
                      }
                      className="w-full text-sm border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Timur (E)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.east}
                      onChange={(e) =>
                        setFormData({ ...formData, east: e.target.value })
                      }
                      className="w-full text-sm border rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-sm font-medium mb-2">
                    File (PDF/Gambar)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setFileInputType("url")}
                      className={`text-xs px-3 py-1 rounded ${
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
                      className={`text-xs px-3 py-1 rounded ${
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
                      value={formData.fileUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, fileUrl: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileChange}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows="2"
                    value={formData.descriptionText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionText: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                form="mapForm"
                className="px-6 py-2 bg-[#3F5F9A] text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdukGIS;
