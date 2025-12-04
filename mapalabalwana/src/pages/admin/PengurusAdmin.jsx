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
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  link: (
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
  ),
};

/* --- 2. CONSTANTS --- */

// Dropdown 1: Jabatan Struktural
const POSITIONS = [
  "Ketua Umum",
  "Sekretaris",
  "Bendahara",
  "Humas",
  "Diklat",
  "Perlengkapan",
  "Litbang",
];

// Dropdown 2: Status Internal (Role)
const ROLES = ["Koordinator", "Anggota"];

// Dropdown 3: Divisi Spesialisasi (Minat Bakat)
const DIVISIONS = [
  "Gunung Hutan",
  "Konservasi",
  "Rock Climbing",
  "-", // Opsi jika anggota belum punya divisi tetap
];

/* --- 3. MAIN COMPONENT --- */
const PengurusAdmin = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageInputType, setImageInputType] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    nia: "",
    position: "Humas", // Dropdown 1 (Jabatan)
    role: "Anggota", // Dropdown 2 (Status)
    division: "Gunung Hutan", // Dropdown 3 (Divisi)
    period: "2024-2025",
    major: "",
    year: "",
    photo: "",
    linkedin: "",
    instagram: "",
  });

  // 1. FETCH DATA
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.getMembers();
      if (response.data.status) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter Logic
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase()) ||
      item.division.toLowerCase().includes(search.toLowerCase()) ||
      (item.nia && item.nia.toLowerCase().includes(search.toLowerCase()))
  );

  // 2. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data pengurus ini?")) {
      try {
        await api.deleteMember(id);
        fetchMembers();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus data.");
      }
    }
  };

  // Handlers Modal
  const handleEdit = (item) => {
    setFormData({
      ...item,
      photo: item.photo || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setImageInputType("url");
    setSelectedFile(null);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      nia: "",
      position: "Humas", // Default Jabatan
      role: "Anggota", // Default Role
      division: "Gunung Hutan", // Default Divisi
      period: "2024-2025",
      major: "",
      year: "",
      photo: "",
      linkedin: "",
      instagram: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setImageInputType("url");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, photo: objectUrl });
    }
  };

  // 3. SUBMIT (CREATE/UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic Khusus: Jika Ketua Umum, Role otomatis 'Ketua' atau 'Koordinator' (disable pilihan)
    let finalRole = formData.role;
    if (formData.position === "Ketua Umum") {
      finalRole = "Ketua"; // Atau biarkan kosong jika tidak perlu role tambahan
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("nia", formData.nia);
    submitData.append("position", formData.position); // Dropdown 1
    submitData.append("role", finalRole); // Dropdown 2
    submitData.append("division", formData.division); // Dropdown 3
    submitData.append("period", formData.period);
    submitData.append("major", formData.major);
    submitData.append("year", formData.year);
    submitData.append("linkedin", formData.linkedin);
    submitData.append("instagram", formData.instagram);

    // File Handling
    if (imageInputType === "file" && selectedFile) {
      submitData.append("photo", selectedFile);
    } else {
      submitData.append("photo", formData.photo);
    }

    try {
      if (isEditing) {
        await api.updateMember(formData.id, submitData);
      } else {
        await api.createMember(submitData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Gagal menyimpan data.");
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
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Pengurus</h1>
          <p className="text-slate-500 text-sm">
            Kelola struktur jabatan, status, dan divisi anggota.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Icon path={icons.plus} className="w-5 h-5" />
          Tambah Pengurus
        </button>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau divisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {loading ? "Memuat..." : `Total: ${filteredData.length} Pengurus`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 border-b border-slate-100 w-16">Foto</th>
                <th className="p-4 border-b border-slate-100">Nama & Info</th>
                <th className="p-4 border-b border-slate-100">
                  Jabatan (Struktural)
                </th>
                <th className="p-4 border-b border-slate-100">
                  Divisi (Spesialisasi)
                </th>
                <th className="p-4 border-b border-slate-100">Periode</th>
                <th className="p-4 border-b border-slate-100 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={getImageUrl(item.photo)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=User";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.nia || "-"}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.major} ({item.year})
                      </div>
                    </td>
                    <td className="p-4">
                      {/* Jabatan + Role */}
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700">
                          {item.position}
                        </span>
                        {item.position !== "Ketua Umum" && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${
                              item.role === "Koordinator"
                                ? "bg-purple-50 text-purple-600 border border-purple-100"
                                : "text-slate-500 bg-slate-100"
                            }`}
                          >
                            {item.role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-medium text-xs px-2 py-1 rounded border ${
                          item.division === "Gunung Hutan"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : item.division === "Konservasi"
                            ? "bg-lime-50 text-lime-700 border-lime-100"
                            : item.division === "Rock Climbing"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {item.division}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs">
                      {item.period}
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
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Data pengurus tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination */}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon path={icons.user} className="w-5 h-5 text-[#3F5F9A]" />
                {isEditing ? "Edit Pengurus" : "Tambah Pengurus Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon path={icons.x} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form
                id="pengurusForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo Input */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Foto Profil
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                      <button
                        type="button"
                        onClick={() => setImageInputType("url")}
                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
                          imageInputType === "url"
                            ? "bg-white shadow-sm text-[#3F5F9A] font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        Link URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputType("file")}
                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
                          imageInputType === "file"
                            ? "bg-white shadow-sm text-[#3F5F9A] font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        Upload
                      </button>
                    </div>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors flex flex-col items-center justify-center h-40 relative overflow-hidden">
                      {formData.photo ? (
                        <img
                          src={getImageUrl(formData.photo)}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                          <Icon
                            path={icons.image}
                            className="w-8 h-8 text-slate-300"
                          />
                        </div>
                      )}
                      <div className="mt-3 w-full">
                        {imageInputType === "url" ? (
                          <input
                            type="text"
                            placeholder="https://..."
                            value={formData.photo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                photo: e.target.value,
                              })
                            }
                            className="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-[#3F5F9A]"
                          />
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Main Data */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                        placeholder="Nama lengkap pengurus"
                      />
                    </div>

                    {/* --- 3 DROPDOWN SECTION --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. JABATAN */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Jabatan Struktural
                        </label>
                        <select
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              position: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                        >
                          {POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. STATUS INTERNAL (ROLE) */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Status Internal
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] disabled:bg-slate-100 disabled:text-slate-400"
                          disabled={formData.position === "Ketua Umum"} // Disable jika Ketua Umum
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        {formData.position === "Ketua Umum" && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            *Otomatis terisi
                          </p>
                        )}
                      </div>

                      {/* 3. DIVISI SPESIALISASI */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Divisi Spesialisasi
                        </label>
                        <select
                          value={formData.division}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              division: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                        >
                          {DIVISIONS.map((div) => (
                            <option key={div} value={div}>
                              {div}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Jurusan
                    </label>
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) =>
                        setFormData({ ...formData, major: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Angkatan
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Periode
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="2024-2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      NIA
                    </label>
                    <input
                      type="text"
                      value={formData.nia}
                      onChange={(e) =>
                        setFormData({ ...formData, nia: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="B.XX.XXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </form>
            </div>

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
                form="pengurusForm"
                className="px-4 py-2 text-white bg-[#3F5F9A] hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-md"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengurusAdmin;
