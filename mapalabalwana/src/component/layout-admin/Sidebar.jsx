import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Map,
  Newspaper,
  Store,
  Database,
  Mountain,
  TreePine,
  Shield,
  FileText,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State untuk Mobile
  const location = useLocation();

  // 1. Gunakan useMemo agar objek menuItems stabil (tidak dibuat ulang tiap render)
  // Ini mengatasi error "missing dependency" di useEffect
  const menuItems = useMemo(
    () => [
      
      {
        id: "produk",
        label: "Produk",
        icon: <Package className="w-5 h-5" />,
        subItems: [
          {
            id: "gis",
            label: "Sistem Informasi Geografi",
            icon: <Map className="w-4 h-4" />,
            href: "/admin/produk/gis",
          },
          {
            id: "portal-berita",
            label: "Portal Berita",
            icon: <Newspaper className="w-4 h-4" />,
            href: "/admin/produk/portal-berita",
          },
          {
            id: "sistem-informasi",
            label: "Sistem Informasi",
            icon: <Database className="w-4 h-4" />,
            href: "/admin/produk/sistem-informasi",
          },
          {
            id: "balwana-store",
            label: "Balwana Store",
            icon: <Store className="w-4 h-4" />,
            href: "/admin/produk/balwana-store",
          },
        ],
      },
      {
        id: "divisi",
        label: "Divisi",
        icon: <Users className="w-5 h-5" />,
        subItems: [
          {
            id: "gunung-hutan",
            label: "Gunung Hutan",
            icon: <Mountain className="w-4 h-4" />,
            href: "/admin/divisi/gunung-hutan",
          },
          {
            id: "konservasi",
            label: "Konservasi",
            icon: <TreePine className="w-4 h-4" />,
            href: "/admin/divisi/konservasi",
          },
          {
            id: "rock-climbing",
            label: "Rock Climbing",
            icon: <Shield className="w-4 h-4" />,
            href: "/admin/divisi/rock-climbing",
          },
        ],
      },
      {
        id: "pengurus",
        label: "Pengurus",
        icon: <FileText className="w-5 h-5" />,
        href: "/admin/pengurus",
      },
      {
        id: "settings",
        label: "Pengaturan",
        icon: <Settings className="w-5 h-5" />,
        href: "/admin/settings",
      },
    ],
    []
  );

  // Effect: Otomatis buka submenu jika halaman aktif ada di dalamnya
  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) => location.pathname.startsWith(sub.href))
    );

    if (activeParent) {
      setOpenSubmenu(activeParent.id);
    }
  }, [location.pathname, menuItems]); // menuItems sudah aman dimasukkan sini

  const toggleSubmenu = (id) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const isActive = (href) => location.pathname === href;
  const isParentActive = (item) =>
    item.subItems?.some((sub) => location.pathname.startsWith(sub.href));

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-700 border border-slate-200"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      {/* Kita ganti motion.div dengan aside + CSS transition biasa agar ringan */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white shadow-xl border-r border-slate-200 z-[70] 
          transition-all duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 flex-none">
          {!isCollapsed && (
            <span className="text-xl font-bold text-[#3F5F9A] truncate font-sans">
              Admin Panel
            </span>
          )}
          <button
            onClick={() =>
              isMobileOpen
                ? setIsMobileOpen(false)
                : setIsCollapsed(!isCollapsed)
            }
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors mx-auto md:mx-0"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6 text-red-500" />
            ) : isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const hasSub = !!item.subItems;
            const active = isActive(item.href) || isParentActive(item);

            return (
              <div key={item.id} className="mb-1">
                {hasSub ? (
                  // SUBMENU TOGGLE
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                      ${
                        active
                          ? "bg-blue-50 text-[#3F5F9A]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#3F5F9A]"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${
                          active
                            ? "text-[#3F5F9A]"
                            : "text-slate-400 group-hover:text-[#3F5F9A]"
                        }`}
                      >
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="font-medium text-sm font-sans">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openSubmenu === item.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  // SINGLE LINK
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)} // Tutup sidebar saat klik di mobile
                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                      ${
                        active
                          ? "bg-[#3F5F9A] text-white shadow-md shadow-blue-900/20"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#3F5F9A]"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div
                      className={`${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#3F5F9A]"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium text-sm font-sans">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu List (Accordion) */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    hasSub && openSubmenu === item.id && !isCollapsed
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                    {item.subItems?.map((sub) => {
                      const isSubActive = isActive(sub.href);
                      return (
                        <Link
                          key={sub.id}
                          to={sub.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors font-sans
                                ${
                                  isSubActive
                                    ? "text-[#3F5F9A] bg-blue-50 font-medium"
                                    : "text-slate-500 hover:text-[#3F5F9A] hover:bg-slate-50"
                                }
                            `}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 flex-none">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3F5F9A] to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              A
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate font-sans">
                  Admin
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  admin@balwana.org
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
