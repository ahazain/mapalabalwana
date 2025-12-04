import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Map,
  Newspaper,
  Store,
  Database,
  Mountain,
  TreePine,
  Shield,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Helper Active Link
  const isActive = (path) => location.pathname === path;

  const produkItems = [
    {
      name: "Sistem Informasi Geografi",
      icon: <Map className="w-5 h-5" />,
      color: "bg-rose-600",
      ripple: "border-rose-400",
      href: "/gis",
    },
    {
      name: "Portal Berita",
      icon: <Newspaper className="w-5 h-5" />,
      color: "bg-violet-600",
      ripple: "border-violet-400",
      href: "/portalberita",
    },
    {
      name: "Sistem Informasi",
      icon: <Database className="w-5 h-5" />,
      color: "bg-teal-600",
      ripple: "border-teal-400",
      href: "/sistem-informasi",
    },
    {
      name: "Balwana Store",
      icon: <Store className="w-5 h-5" />,
      color: "bg-orange-600",
      ripple: "border-orange-400",
      href: "/balwana-store",
    },
  ];

  const divisiItems = [
    {
      name: "Gunung Hutan",
      icon: <Mountain className="w-5 h-5" />,
      color: "bg-emerald-600",
      ripple: "border-emerald-400",
      href: "/divisi/gununghutan",
    },
    {
      name: "Konservasi",
      icon: <TreePine className="w-5 h-5" />,
      color: "bg-green-600",
      ripple: "border-green-400",
      href: "/divisi/konservasi",
    },
    {
      name: "Rock Climbing",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-slate-700",
      ripple: "border-slate-400",
      href: "/divisi/rockclimbing",
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-lg shadow-sm"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* 🧭 Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-black tracking-tight font-poppins">
                mapala balwana
              </h1>
            </Link>

            {/* 🌐 Desktop Menu */}
            <div
              className="hidden lg:flex items-center space-x-2"
              ref={dropdownRef}
            >
              <Link
                to="/"
                onClick={closeAllDropdowns}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-poppins ${
                  isActive("/")
                    ? "text-[#3F5F9A] bg-[#3F5F9A]/5"
                    : "text-gray-900 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                Home
              </Link>

              {/* 📁 Produk */}
              <DropdownMenu
                title="Produk"
                items={produkItems}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                closeAllDropdowns={closeAllDropdowns}
              />

              {/* 🏔️ Divisi */}
              <DropdownMenu
                title="Divisi"
                items={divisiItems}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                closeAllDropdowns={closeAllDropdowns}
              />

              {[
                { name: "Galeri", href: "/galeri" },
                { name: "Pengurus", href: "/pengurus" },
                { name: "Tentang Kami", href: "/tentang-kami" },
                { name: "Kontak", href: "/kontak" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeAllDropdowns}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-poppins ${
                    isActive(item.href)
                      ? "text-[#3F5F9A] bg-[#3F5F9A]/5"
                      : "text-gray-900 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* 📱 Tombol Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-900 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* 📱 Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 animate-slideDown h-screen overflow-y-auto pb-20">
            <div className="px-4 pt-3 pb-6 space-y-2">
              <Link
                to="/"
                onClick={closeAllDropdowns}
                className={`block px-4 py-2 rounded-lg transition-all duration-200 font-poppins ${
                  isActive("/")
                    ? "bg-[#3F5F9A]/10 text-[#3F5F9A] font-bold"
                    : "text-gray-900 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                Home
              </Link>

              {/* Dropdown mobile */}
              <DropdownMobile
                label="Produk"
                items={produkItems}
                active={activeDropdown === "produk-mobile"}
                toggle={() => toggleDropdown("produk-mobile")}
                close={closeAllDropdowns}
              />

              <DropdownMobile
                label="Divisi"
                items={divisiItems}
                active={activeDropdown === "divisi-mobile"}
                toggle={() => toggleDropdown("divisi-mobile")}
                close={closeAllDropdowns}
              />

              {[
                { name: "Galeri", href: "/galeri" },
                { name: "Pengurus", href: "/pengurus" },
                { name: "Tentang Kami", href: "/tentang-kami" },
                { name: "Kontak", href: "/kontak" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeAllDropdowns}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 font-poppins ${
                    isActive(item.href)
                      ? "bg-[#3F5F9A]/10 text-[#3F5F9A] font-bold"
                      : "text-gray-900 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="h-14 sm:h-16"></div>
    </>
  );
};

// ⚙️ Dropdown Desktop
const DropdownMenu = ({
  title,
  items,
  activeDropdown,
  toggleDropdown,
  hoveredItem,
  setHoveredItem,
  closeAllDropdowns,
}) => {
  const gridCols =
    items.length <= 2
      ? "grid-cols-2"
      : items.length === 3
      ? "grid-cols-3"
      : "grid-cols-4";
  const dropdownWidth =
    items.length <= 2
      ? "w-[250px]"
      : items.length === 3
      ? "w-[400px]"
      : "w-[600px]";

  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(title.toLowerCase())}
        className="flex items-center text-gray-900 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-poppins"
      >
        {title}
        <ChevronDown
          className={`ml-1 w-4 h-4 transition-transform duration-200 ${
            activeDropdown === title.toLowerCase() ? "rotate-180" : ""
          }`}
        />
      </button>

      {activeDropdown === title.toLowerCase() && (
        <div
          className={`absolute top-full left-1/2 overflow-visible transform -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-4 transition-all duration-300 ease-in-out ${dropdownWidth}`}
        >
          <div className={`grid ${gridCols} gap-3`}>
            {items.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                onClick={closeAllDropdowns}
                className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
              >
                {/* 🌊 Ripple Ultra Effect */}
                <motion.div
                  className="relative w-12 h-12 flex items-center justify-center text-white mb-2 cursor-pointer"
                  onHoverStart={() => setHoveredItem(i)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <motion.span
                    className={`absolute inset-0 rounded-full border-2 ${item.ripple}`}
                    animate={
                      hoveredItem === i
                        ? { scale: [1, 1.6, 2.2], opacity: [0.6, 0.3, 0] }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 1.2,
                      ease: "easeOut",
                      repeat: hoveredItem === i ? Infinity : 0,
                      repeatDelay: 0.4,
                    }}
                  />
                  <motion.span
                    className={`absolute inset-0 rounded-full border ${item.ripple}`}
                    animate={
                      hoveredItem === i
                        ? { scale: [1, 1.9, 2.8], opacity: [0.5, 0.2, 0] }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 1.6,
                      ease: "easeOut",
                      repeat: hoveredItem === i ? Infinity : 0,
                      repeatDelay: 0.6,
                    }}
                  />
                  <motion.span
                    className={`absolute inset-0 rounded-full border ${item.ripple}`}
                    animate={
                      hoveredItem === i
                        ? { scale: [1, 2.3, 3.2], opacity: [0.4, 0.2, 0] }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 1.9,
                      ease: "easeOut",
                      repeat: hoveredItem === i ? Infinity : 0,
                      repeatDelay: 0.8,
                    }}
                  />
                  <div
                    className={`relative z-10 ${item.color} w-full h-full rounded-full flex items-center justify-center shadow-md`}
                  >
                    {item.icon}
                  </div>
                </motion.div>

                <span className="text-center text-sm font-medium text-gray-800 group-hover:text-purple-600 font-poppins">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ⚙️ Dropdown Mobile (FIXED)
const DropdownMobile = ({ label, items, active, toggle, close }) => (
  <div>
    <button
      onClick={toggle}
      className="flex justify-between w-full text-gray-900 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-all duration-200 font-poppins"
    >
      {label}
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 ${
          active ? "rotate-180" : ""
        }`}
      />
    </button>

    {active && (
      <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-100 ml-4">
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.href}
            onClick={(e) => {
              // Mencegah event bubbling
              e.stopPropagation();
              close();
            }}
            className="flex items-center px-4 py-2 text-gray-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-poppins"
          >
            <div
              className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-white mr-3 shrink-0`}
            >
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default Navbar;
