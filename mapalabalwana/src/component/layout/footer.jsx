import React from "react";

/* --- 1. ICON HELPER & DATA --- */
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
  mountain: <path d="M5 12l5-5 4 4 6-6v13H5z" />,
  map: (
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  ),
  newspaper: (
    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  store: <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  tree: (
    <path d="M12 2L8 8h8l-4-6zM10 8L6 14h12l-4-6M8 14l-4 6h16l-4-6M12 20v2" />
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
  ),
  mapPin: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  twitter: (
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  ),
  youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
};

/* --- 2. MAIN COMPONENT --- */

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const produkLinks = [
    { name: "Sistem Informasi Geografi", icon: "map" },
    { name: "Portal Berita", icon: "newspaper" },
    { name: "Sistem Informasi Internal", icon: "database" },
    { name: "Balwana Store", icon: "store" },
  ];

  const divisiLinks = [
    { name: "Gunung Hutan", icon: "mountain" },
    { name: "Konservasi", icon: "tree" },
    { name: "Rock Climbing", icon: "shield" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: "instagram", color: "hover:text-pink-500" },
    { name: "Facebook", icon: "facebook", color: "hover:text-blue-500" },
    { name: "Twitter", icon: "twitter", color: "hover:text-sky-500" },
    { name: "YouTube", icon: "youtube", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans relative overflow-hidden">
      {/* Background Tech Grid Pattern (Consistent with Home) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* 1. BRANDING */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3F5F9A] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                <Icon path={icons.mountain} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Balwana.
                </h3>
                <p className="text-[10px] text-[#3F5F9A] font-bold uppercase tracking-widest">
                  Mapala Fasilkom
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Menggabungkan eksplorasi alam liar dengan teknologi Sistem
              Informasi Geografis (GIS) untuk konservasi yang terukur.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Icon
                  path={icons.mapPin}
                  className="w-5 h-5 text-[#3F5F9A] mt-0.5"
                />
                <span>Universitas Jember, Jl. Kalimantan 37, Jember 68121</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon path={icons.mail} className="w-5 h-5 text-[#3F5F9A]" />
                <span>info@mapalabalwana.org</span>
              </div>
            </div>
          </div>

          {/* 2. PRODUK DIGITAL */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">
              Produk Digital
            </h4>
            <ul className="space-y-4 text-sm">
              {produkLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-[#3F5F9A] transition-colors group"
                  >
                    <span className="p-1.5 rounded bg-slate-800 group-hover:bg-[#3F5F9A] group-hover:text-white transition-colors text-slate-500">
                      <Icon path={icons[link.icon]} className="w-4 h-4" />
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. DIVISI */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Divisi</h4>
            <ul className="space-y-4 text-sm">
              {divisiLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-[#3F5F9A] transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[#3F5F9A] transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. SOCIAL & NEWSLETTER */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Terhubung</h4>
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center transition-all hover:bg-white ${social.color}`}
                  title={social.name}
                >
                  <Icon path={icons[social.icon]} className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 mb-3">
                Subscribe untuk update kegiatan terbaru.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3F5F9A]"
                />
                <button className="bg-[#3F5F9A] text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors">
                  <Icon path={icons.arrowUp} className="w-4 h-4 rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2025 Mapala Balwana Fasilkom. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Made with{" "}
              <Icon
                path={icons.heart}
                className="w-3 h-3 text-red-500 fill-current animate-pulse"
              />{" "}
              by Balwana Dev
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-slate-300 hover:text-[#3F5F9A] transition-colors"
            >
              Back to Top <Icon path={icons.arrowUp} className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
