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

// ICONS DATA
const icons = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  shoppingBag: (
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  ),
  shoppingCart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  whatsapp: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  tag: (
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
  ),
  check: <polyline points="20 6 9 17 4 12" />,
};

const categories = ["Semua", "Kaos", "Pakaian", "Aksesoris", "Perlengkapan"];

/* --- 3. MAIN COMPONENT --- */
const BalwanaStorePage = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: Set default fallback number disini jika API belum update/fail
  const [adminPhone, setAdminPhone] = useState("6285389276950");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resSettings] = await Promise.all([
          api.getProducts(),
          api.getSettings(),
        ]);

        if (resProducts.data.status) {
          setProductsData(resProducts.data.data);
        }

        if (resSettings.data.status && resSettings.data.data.phone) {
          setAdminPhone(resSettings.data.data.phone);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToastMessage(`+ ${product.name} ditambahkan`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  // --- CHECKOUT LOGIC ---
  const handleCheckout = () => {
    // Pastikan format nomor bersih (hanya angka)
    const cleanPhone = adminPhone.replace(/\D/g, "");

    if (!cleanPhone) {
      alert("Nomor WhatsApp Admin tidak valid.");
      return;
    }

    let message = "Halo Admin Balwana Store, saya ingin memesan:%0A%0A";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.qty}) - Rp ${(
        Number(item.price) * item.qty
      ).toLocaleString("id-ID")}%0A`;
    });

    const total = cart.reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0
    );
    message += `%0A*Total: Rp ${total.toLocaleString("id-ID")}*`;
    message += "%0A%0AMohon info ketersediaan dan ongkirnya. Terima kasih.";

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const totalCartPrice = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // Helper Image
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=No+Img";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f9fafe] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3F5F9A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800">
      <div className="bg-[#3F5F9A] text-white pt-24 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4">
            <Icon path={icons.shoppingBag} className="w-4 h-4" /> Official
            Merchandise
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Balwana Store.
          </h1>
          <p className="text-blue-100 max-w-xl mx-auto text-lg">
            Lengkapi perlengkapan petualanganmu dengan merchandise resmi
            berkualitas. Hasil penjualan mendukung kegiatan konservasi kami.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-4 z-20 bg-[#f9fafe]/90 backdrop-blur-md py-4 rounded-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#3F5F9A] text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon path={icons.search} className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] transition-all text-sm shadow-sm"
              placeholder="Cari merchandise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-[#3F5F9A] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                    {product.tag}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-white text-[#3F5F9A] font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 text-sm"
                  >
                    <Icon path={icons.shoppingCart} className="w-4 h-4" /> Add
                    to Cart
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-slate-500 mb-1">
                  {product.category}
                </p>
                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug mb-auto group-hover:text-[#3F5F9A] transition-colors">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-[#3F5F9A]">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        path={icons.star}
                        className="w-3 h-3 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Icon path={icons.search} className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              Produk tidak ditemukan
            </h3>
            <p className="text-slate-500 text-sm">
              Coba cari dengan kata kunci lain.
            </p>
          </div>
        )}
      </main>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#3F5F9A] text-white">
          <div className="flex items-center gap-3">
            <Icon path={icons.shoppingBag} className="w-6 h-6" />
            <h2 className="text-lg font-bold">Keranjang ({totalItems})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon path={icons.x} className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Icon
                path={icons.shoppingCart}
                className="w-16 h-16 opacity-20"
              />
              <p>Keranjang belanja masih kosong.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#3F5F9A] font-bold text-sm hover:underline"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#3F5F9A] text-sm">
                      Rp{" "}
                      {(Number(item.price) * item.qty).toLocaleString("id-ID")}
                    </span>
                    <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 border border-slate-200 shadow-sm">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Icon path={icons.minus} className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="text-slate-400 hover:text-[#3F5F9A] transition-colors"
                      >
                        <Icon path={icons.plus} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-300 hover:text-red-500 self-start p-1"
                >
                  <Icon path={icons.trash} className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-sm">Total Pembayaran</span>
              <span className="text-xl font-bold text-slate-900">
                Rp {totalCartPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
            >
              <Icon path={icons.whatsapp} className="w-5 h-5 fill-current" />{" "}
              Checkout via WhatsApp
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3">
              Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-[#3F5F9A] text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center"
      >
        <div className="relative">
          <Icon path={icons.shoppingCart} className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#3F5F9A]">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-in">
          <div className="bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium">
            <div className="bg-green-500 rounded-full p-1">
              <Icon path={icons.check} className="w-3 h-3" />
            </div>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalwanaStorePage;
