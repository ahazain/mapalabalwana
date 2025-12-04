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
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
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
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  zoomIn: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </>
  ),
};

/* --- 2. MAIN COMPONENT --- */
const GaleriPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState(null); // For Lightbox
  const [loading, setLoading] = useState(true);

  const categories = ["Semua", "Gunung Hutan", "Konservasi", "Rock Climbing", "Diklat", "Kegiatan Umum"];

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getGalleries();
        if (response.data.status) {
          setGalleries(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (selectedCategory === "Semua") {
      setFilteredData(galleries);
    } else {
      setFilteredData(galleries.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, galleries]);

  // Helper Image URL
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x400?text=No+Image";
    return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      
      {/* --- HERO --- */}
      <div className="relative bg-[#3F5F9A] overflow-hidden pt-24 pb-20">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-6">
                <Icon path={icons.camera} className="w-4 h-4" /> Dokumentasi & Memori
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Galeri Balwana.</h1>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
                Rekam jejak visual dari setiap langkah petualangan, aksi konservasi, dan kebersamaan keluarga besar Mapala Balwana.
            </p>
         </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 pb-20">
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 mb-12 flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === cat 
                        ? "bg-[#3F5F9A] text-white shadow-lg shadow-blue-900/20" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Gallery Grid (Masonry-like with CSS Grid) */}
        {loading ? (
            <div className="text-center py-20 text-slate-400">Memuat galeri...</div>
        ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                {filteredData.map((item, i) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedImage(item)}
                        className={`group relative rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-500 ${
                            // Logic sederhana untuk membuat variasi ukuran (bento style)
                            // Item ke-1, 5, 9... akan span 2 kolom & 2 baris di desktop
                            (i % 5 === 0) ? "lg:col-span-2 lg:row-span-2" : ""
                        }`}
                    >
                        <img 
                            src={getImageUrl(item.imageUrl)} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="absolute bottom-0 left-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                 <span className="text-[#3F5F9A] bg-white/90 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                                    {item.category}
                                 </span>
                                 <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                                 <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.description}</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <h3 className="text-lg font-bold text-slate-700">Galeri Kosong</h3>
                <p className="text-slate-500">Belum ada foto untuk kategori ini.</p>
            </div>
        )}

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
              
              {/* Close Button */}
              <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
                  <Icon path={icons.x} className="w-8 h-8" />
              </button>

              <div className="max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-0 md:gap-8 bg-transparent md:items-center" onClick={e => e.stopPropagation()}>
                  {/* Image */}
                  <div className="flex-1 flex items-center justify-center">
                       <img 
                          src={getImageUrl(selectedImage.imageUrl)} 
                          alt={selectedImage.title} 
                          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                       />
                  </div>

                  {/* Info (Optional, for desktop side panel or bottom) */}
                  <div className="md:w-80 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-xl text-white mt-4 md:mt-0">
                       <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                       <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                           <span className="bg-[#3F5F9A] px-2 py-0.5 rounded text-white text-xs">{selectedImage.category}</span>
                           <span>{new Date(selectedImage.date).toLocaleDateString('id-ID')}</span>
                       </div>
                       <p className="text-gray-300 leading-relaxed text-sm">
                           {selectedImage.description || "Tidak ada deskripsi."}
                       </p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default GaleriPage;