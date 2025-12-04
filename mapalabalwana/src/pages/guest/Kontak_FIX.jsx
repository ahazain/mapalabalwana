import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Import API

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
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  mapPin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
};

const Kontak_FIX = () => {
  // State data organisasi (Default placeholder sebelum fetch)
  const [orgData, setOrgData] = useState({
    name: "Mapala Balwana",
    address: "Memuat alamat...",
    email: "loading...",
    phone: "loading...",
    instagram: "#",
    facebook: "#",
    twitter: "#",
    youtube: "#",
  });

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // 1. FETCH SETTINGS DARI API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.getSettings();
        if (response.data.status) {
          setOrgData(response.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data kontak:", error);
      }
    };
    fetchSettings();
  }, []);

  // 2. LOGIC KIRIM PESAN (Redirect ke WA)
  const handleSendMessage = (e) => {
    e.preventDefault();

    // Ambil nomor WA dari data API, hapus karakter non-digit (spasi, strip, +)
    const cleanPhone = orgData.phone ? orgData.phone.replace(/\D/g, "") : "";

    // Format Pesan
    const text = `Halo Admin ${orgData.name},%0A%0ASaya ${form.name} (${form.email}).%0A%0APesan:%0A${form.message}`;

    // Buka Link WA
    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
    } else {
      alert("Nomor WhatsApp admin belum diatur.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-[#3F5F9A] overflow-hidden pt-24 pb-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-6">
            <Icon path={icons.message} className="w-4 h-4" /> Hubungi Kami
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Tetap Terhubung.
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Punya pertanyaan tentang keanggotaan, kerja sama, atau kegiatan
            kami? Jangan ragu untuk menghubungi tim {orgData.name}.
          </p>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left: Contact Form */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Kirim Pesan
              </h2>
              <form onSubmit={handleSendMessage} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] transition-all bg-slate-50 focus:bg-white"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] transition-all bg-slate-50 focus:bg-white"
                    placeholder="nama@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3F5F9A]/50 focus:border-[#3F5F9A] transition-all bg-slate-50 focus:bg-white resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3F5F9A] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Icon path={icons.send} className="w-4 h-4" />
                  Kirim via WhatsApp
                </button>
              </form>
            </div>

            {/* Right: Contact Info & Map */}
            <div className="bg-slate-50 p-8 md:p-12 flex flex-col justify-between border-l border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3F5F9A]/10 rounded-full flex items-center justify-center text-[#3F5F9A] shrink-0">
                      <Icon path={icons.mapPin} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Alamat Sekretariat
                      </h4>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                        {orgData.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3F5F9A]/10 rounded-full flex items-center justify-center text-[#3F5F9A] shrink-0">
                      <Icon path={icons.mail} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Email</h4>
                      <p className="text-slate-600 text-sm mt-1">
                        {orgData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#3F5F9A]/10 rounded-full flex items-center justify-center text-[#3F5F9A] shrink-0">
                      <Icon path={icons.phone} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Telepon / WhatsApp
                      </h4>
                      <p className="text-slate-600 text-sm mt-1">
                        {orgData.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-slate-800 mb-4">
                    Media Sosial
                  </h4>
                  <div className="flex gap-3">
                    {orgData.instagram && (
                      <a
                        href={orgData.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#E1306C] hover:border-[#E1306C] transition-all shadow-sm hover:shadow-md"
                      >
                        <Icon path={icons.instagram} className="w-5 h-5" />
                      </a>
                    )}
                    {orgData.linkedin && (
                      <a
                        href={orgData.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0077b5] hover:border-[#0077b5] transition-all shadow-sm hover:shadow-md"
                      >
                        <Icon path={icons.linkedin} className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Google Map Embed (Static for now, or you can add field in settings) */}
              <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.4241666687835!2d113.71457637499365!3d-8.15994999187063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd694351d727e69%3A0xec53c7131758f807!2sUniversitas%20Jember!5e0!3m2!1sid!2sid!4v1709623456789!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Balwana"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kontak_FIX;
