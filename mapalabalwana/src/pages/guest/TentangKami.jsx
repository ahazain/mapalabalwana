import React from "react";

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
  mountain: <path d="M5 12l5-5 4 4 6-6v13H5z" />,
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  leaf: (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
  ), // Simple leaf
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
};

/* --- 2. MAIN COMPONENT --- */

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 selection:bg-[#3F5F9A]/20 selection:text-[#3F5F9A]">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#3F5F9A] overflow-hidden pt-32 pb-24">
        {/* Abstract Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
            <Icon path={icons.mountain} className="w-4 h-4" />
            Est. 1995
          </div>
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Tentang Balwana.
          </h1>
          <p
            className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Organisasi pecinta alam yang tumbuh dari semangat persaudaraan,
            dedikasi pada ilmu pengetahuan, dan cinta yang tulus terhadap alam
            Indonesia.
          </p>
        </div>
      </section>

      {/* --- WHO WE ARE --- */}
      <section className="py-24 bg-white relative">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Composition */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#3F5F9A] rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop"
                alt="Tim Balwana"
                className="relative rounded-2xl shadow-xl w-full object-cover z-10"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 z-20 max-w-xs hidden md:block">
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Anggota Aktif
                </p>
                <div className="text-3xl font-bold text-[#3F5F9A]">150+</div>
                <p className="text-xs text-slate-400">
                  Mahasiswa dari berbagai jurusan
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-[#3F5F9A] font-bold uppercase tracking-wider text-sm mb-2 block">
                Siapa Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Sinergi Mahasiswa & Alam
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                <strong>Mapala Balwana</strong> adalah unit kegiatan mahasiswa
                yang tidak hanya sekadar mendaki gunung, tetapi juga belajar
                dari alam. Kami menggabungkan kegiatan alam bebas dengan
                disiplin ilmu akademis.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Sejak berdiri, kami terus konsisten melakukan ekspedisi, riset
                lingkungan, dan pengabdian masyarakat. Kami percaya bahwa alam
                adalah laboratorium terbesar tempat karakter manusia ditempa.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Icon path={icons.leaf} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Konservasi</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Aksi nyata pelestarian lingkungan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Icon path={icons.compass} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Eksplorasi</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Menjelajah kawasan yang belum terjamah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VISI & MISI --- */}
      <section className="py-24 bg-[#f9fafe]">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Arah & Tujuan
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Landasan idealisme yang menjadi pedoman setiap langkah organisasi
              dalam berkarya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Icon path={icons.target} className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Visi</h3>
              <p className="text-slate-600 leading-relaxed">
                "Menjadi organisasi pecinta alam yang unggul dalam pelestarian
                lingkungan, pengembangan karakter, dan persaudaraan berbasis
                kecintaan terhadap alam serta ketaqwaan kepada Tuhan YME."
              </p>
            </div>

            {/* Misi Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                <Icon path={icons.compass} className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Misi</h3>
              <ul className="space-y-4">
                {[
                  "Mengembangkan kepribadian tangguh dan cinta lingkungan.",
                  "Melaksanakan eksplorasi dan konservasi berkelanjutan.",
                  "Menjalin kerjasama strategis dengan pihak eksternal.",
                  "Membangun solidaritas dan kekeluargaan yang kokoh.",
                ].map((misi, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon
                        path={icons.check}
                        className="w-3 h-3 text-[#3F5F9A]"
                      />
                    </div>
                    {misi}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nilai Dasar
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Prinsip yang kami pegang teguh dalam setiap kegiatan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Persaudaraan",
                desc: "Ikatan keluarga yang kuat melampaui sekadar organisasi.",
                icon: "users",
                color: "text-blue-600 bg-blue-50",
              },
              {
                title: "Ketangguhan",
                desc: "Mental baja dalam menghadapi tantangan alam maupun hidup.",
                icon: "mountain",
                color: "text-slate-700 bg-slate-100",
              },
              {
                title: "Kepedulian",
                desc: "Peka terhadap isu lingkungan dan kondisi sosial masyarakat.",
                icon: "heart",
                color: "text-red-500 bg-red-50",
              },
            ].map((val, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
              >
                <div
                  className={`w-16 h-16 ${val.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm`}
                >
                  <Icon path={icons[val.icon]} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {val.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
