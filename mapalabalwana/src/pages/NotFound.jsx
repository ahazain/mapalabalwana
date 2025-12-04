import React from "react";
import { Link } from "react-router-dom";

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
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, // Simple home
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  map: <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3F5F9A 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      
      {/* Floating Elements Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        
        {/* 404 Graphic */}
        <div className="relative flex items-center justify-center gap-4 mb-8 font-black text-[#3F5F9A] text-9xl select-none opacity-90">
            <span style={{ animation: 'float 6s ease-in-out infinite' }}>4</span>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-full border-4 border-[#3F5F9A] flex items-center justify-center shadow-xl"
                 style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }}>
                <div style={{ animation: 'spin-slow 10s linear infinite' }}>
                    <Icon path={icons.compass} className="w-16 h-16 md:w-20 md:h-20 text-[#3F5F9A]" />
                </div>
            </div>
            <span style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }}>4</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Waduh! Anda Tersesat?
        </h1>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Halaman yang Anda cari sepertinya sudah dipindahkan, dihapus, atau mungkin memang tidak pernah ada di peta kami.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                to="/" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3F5F9A] text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1"
            >
                <Icon path={icons.home} className="w-5 h-5" />
                Kembali ke Basecamp
            </Link>
            
            <button 
                onClick={() => window.history.back()} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
                <Icon path={icons.arrowLeft} className="w-5 h-5" />
                Kembali Sebelumnya
            </button>
        </div>

      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-8 text-slate-400 text-xs font-mono">
        ERR_CODE: 404_PAGE_NOT_FOUND | MAPALA BALWANA
      </div>

    </div>
  );
};

export default NotFound;