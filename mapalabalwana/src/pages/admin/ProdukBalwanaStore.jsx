import React, { useState, useEffect } from "react";
import api from "../../services/Api"; // Import API
import { IMAGE_URL } from "../../services/Config"; // Import URL Config

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
  shoppingBag: (
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  ),
  tag: (
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  dollarSign: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
};

const categories = [
  "Kaos",
  "Pakaian",
  "Aksesoris",
  "Perlengkapan",
  "Alat Camping",
];

/* --- 2. MAIN COMPONENT --- */
const ProdukBalwanaStore = () => {
  // HAPUS DATA STATIS, MULAI DENGAN ARRAY KOSONG
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageInputType, setImageInputType] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "Kaos",
    stock: "",
    image: "",
    tag: "",
  });

  // 1. FETCH DATA (READ)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts();
      if (response.data.status) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // 2. DELETE DATA
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await api.deleteProduct(id);
        fetchProducts(); // Refresh data
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus produk.");
      }
    }
  };

  // Open Modal Edit
  const handleEdit = (item) => {
    setFormData({
      ...item,
      tag: item.tag || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setImageInputType("url");
    setSelectedFile(null);
  };

  // Open Modal Add
  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      category: "Kaos",
      stock: "",
      image: "",
      tag: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setImageInputType("url");
    setSelectedFile(null);
  };

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: objectUrl });
    }
  };

  // 3. SUBMIT (CREATE & UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("stock", formData.stock);
    submitData.append("tag", formData.tag);

    if (imageInputType === "file" && selectedFile) {
      submitData.append("image", selectedFile);
    } else {
      submitData.append("image", formData.image);
    }

    try {
      if (isEditing) {
        await api.updateProduct(formData.id, submitData);
      } else {
        await api.createProduct(submitData);
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh Data
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan data. Cek koneksi atau login ulang.");
    }
  };

  // Helper Format Currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Helper Image
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=No+Img";
    return url.startsWith("http") || url.startsWith("blob")
      ? url
      : `${IMAGE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-4 md:p-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Toko</h1>
          <p className="text-slate-500 text-sm">
            Kelola produk, harga, dan stok Balwana Store.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#3F5F9A] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Icon path={icons.plus} className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {loading ? "Memuat..." : `Total: ${filteredProducts.length} Produk`}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 border-b border-slate-100 text-center w-10">
                  No
                </th>{" "}
                {/* Kolom No */}
                <th className="p-4 border-b border-slate-100 w-20">Gambar</th>
                <th className="p-4 border-b border-slate-100">Nama Produk</th>
                <th className="p-4 border-b border-slate-100">Kategori</th>
                <th className="p-4 border-b border-slate-100">Harga</th>
                <th className="p-4 border-b border-slate-100">Stok</th>
                <th className="p-4 border-b border-slate-100">Label</th>
                <th className="p-4 border-b border-slate-100 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Loading Data...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* NOMOR URUT DINAMIS (Index + 1) */}
                    <td className="p-4 text-center text-slate-500">
                      {index + 1}
                    </td>

                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Img";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        DB_ID: {item.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#3F5F9A]">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-4 text-slate-600">{item.stock} pcs</td>
                    <td className="p-4">
                      {item.tag ? (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-600 border border-orange-200">
                          {item.tag}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Icon
                          path={icons.shoppingBag}
                          className="w-6 h-6 text-slate-300"
                        />
                      </div>
                      <p>Produk tidak ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Visual Only for now) */}
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
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon
                  path={icons.shoppingBag}
                  className="w-5 h-5 text-[#3F5F9A]"
                />
                {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
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
              <form
                id="productForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Image Section */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Foto Produk
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex bg-slate-100 p-1 rounded-lg mb-3 w-fit">
                        <button
                          type="button"
                          onClick={() => setImageInputType("url")}
                          className={`text-xs px-3 py-1.5 rounded-md transition-all ${
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
                          className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                            imageInputType === "file"
                              ? "bg-white shadow-sm text-[#3F5F9A] font-bold"
                              : "text-slate-500"
                          }`}
                        >
                          Upload
                        </button>
                      </div>
                      {imageInputType === "url" ? (
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] text-sm"
                        />
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}
                    </div>
                    <div className="w-32 h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                      {formData.image ? (
                        <img
                          src={getImageUrl(formData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <Icon
                            path={icons.image}
                            className="w-8 h-8 mx-auto"
                          />
                          <span className="text-[10px]">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      placeholder="Nama produk lengkap..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Stok
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                      placeholder="0"
                    />
                  </div>

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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Label / Tag (Opsional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icon path={icons.tag} className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) =>
                          setFormData({ ...formData, tag: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A]"
                        placeholder="Contoh: Best Seller"
                      />
                    </div>
                  </div>
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
                form="productForm"
                className="px-6 py-2 text-white bg-[#3F5F9A] hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-md"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdukBalwanaStore;
