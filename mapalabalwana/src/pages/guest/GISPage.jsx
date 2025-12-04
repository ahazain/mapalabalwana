import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/Api";
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
  folder: (
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  folderOpen: (
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  fileText: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ),
  maximize: (
    <>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </>
  ),
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  menu: (
    <>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  map: (
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  ),
  navigation: <polygon points="3 11 22 2 13 21 11 13 3 11" />,
  zoomIn: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  mapPin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
};

/* --- 2. COMPONENT: GEOREFERENCED PDF VIEWER --- */
const GeoreferencedPDFViewer = ({ pdfUrl, bounds }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [cursorCoord, setCursorCoord] = useState(null);

  // Menggunakan useCallback agar fungsi tidak direkreasi setiap render
  const renderPage = useCallback(async (pdf, num, scaleValue) => {
    setLoading(true);
    try {
      const page = await pdf.getPage(num);
      const viewport = page.getViewport({ scale: scaleValue });

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      }
    } catch (e) {
      console.error("Render error:", e);
    }
    setLoading(false);
  }, []);

  // Load PDF.js Library from CDN
  useEffect(() => {
    const loadLib = async () => {
      if (!window.pdfjsLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          fetchPdf();
        };
        document.body.appendChild(script);
      } else {
        fetchPdf();
      }
    };

    const fetchPdf = async () => {
      setLoading(true);
      try {
        const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        // Hapus panggilan renderPage di sini, biarkan useEffect kedua yang menanganinya
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };

    if (pdfUrl) loadLib();
  }, [pdfUrl]);

  // Effect khusus untuk render saat state berubah
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, pageNum, scale);
    }
  }, [pdfDoc, pageNum, scale, renderPage]);

  // Logic Hitung Koordinat
  const handleMouseMove = (e) => {
    if (!bounds || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    const n = parseFloat(bounds.n);
    const s = parseFloat(bounds.s);
    const e_lng = parseFloat(bounds.e);
    const w = parseFloat(bounds.w);

    if (!isNaN(n) && !isNaN(s) && !isNaN(e_lng) && !isNaN(w)) {
      const lat = n - (n - s) * yPercent;
      const lng = w + (e_lng - w) * xPercent;
      setCursorCoord({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    }
  };

  const handleZoom = (direction) => {
    setScale((prev) => {
      const newScale = direction === "in" ? prev + 0.25 : prev - 0.25;
      return Math.max(0.5, Math.min(4, newScale));
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden rounded-2xl border border-slate-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          {pdfDoc && (
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                disabled={pageNum <= 1}
                className="p-1 hover:bg-white rounded disabled:opacity-30"
              >
                <Icon path={icons.chevronLeft} className="w-3 h-3" />
              </button>
              <span className="text-xs text-slate-600 font-mono px-2">
                {pageNum} / {pdfDoc.numPages}
              </span>
              <button
                onClick={() =>
                  setPageNum((p) => Math.min(pdfDoc.numPages, p + 1))
                }
                disabled={pageNum >= pdfDoc.numPages}
                className="p-1 hover:bg-white rounded disabled:opacity-30"
              >
                <Icon path={icons.chevronRight} className="w-3 h-3" />
              </button>
            </div>
          )}
          {!bounds && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
              <Icon path={icons.alert} className="w-3 h-3" /> No Coords
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom("out")}
            className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 text-slate-600"
          >
            <Icon path={icons.zoomOut} className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => handleZoom("in")}
            className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 text-slate-600"
          >
            <Icon path={icons.zoomIn} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="flex-1 overflow-auto flex items-start justify-center bg-slate-800/50 relative"
        ref={containerRef}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-900/20 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-[#3F5F9A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorCoord(null)}
          className="shadow-2xl cursor-crosshair my-4 origin-top"
        />
      </div>

      {/* Coordinate Tooltip */}
      {cursorCoord && (
        <div className="absolute bottom-6 left-6 z-50 bg-black/80 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-xl pointer-events-none animate-in fade-in duration-200">
          <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">
            KOORDINAT
          </div>
          <div className="font-mono text-sm grid grid-cols-1 gap-0.5">
            <div className="flex gap-2">
              <span className="text-emerald-400 w-8">LAT</span>{" "}
              <span>{cursorCoord.lat}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-cyan-400 w-8">LNG</span>{" "}
              <span>{cursorCoord.lng}</span>
            </div>
          </div>
        </div>
      )}

      {/* Script loader handled in useEffect */}
    </div>
  );
};

/* --- 3. MAIN PAGE COMPONENT --- */
const GISPage = () => {
  const [foldersData, setFoldersData] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // State khusus untuk Koordinat Gambar
  const [cursorCoord, setCursorCoord] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  const getFileUrl = (path) =>
    !path ? "#" : path.startsWith("http") ? path : `${IMAGE_URL}${path}`;
  const isPdf = (url) => url && url.toLowerCase().endsWith(".pdf");
  const isImageFile = (url) => url && url.match(/\.(jpeg|jpg|png|webp|gif)$/i);

  const getMapBounds = (map) => {
    try {
      const meta = JSON.parse(map.description);
      return meta.bounds || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await api.getMaps();
        if (response.data.status) {
          const maps = response.data.data;
          const grouped = maps.reduce((acc, map) => {
            const categoryName = map.category || "Lainnya";
            const folderId = categoryName.toLowerCase().replace(/\s+/g, "-");
            let folder = acc.find((f) => f.id === folderId);
            if (!folder) {
              let colorClass = "text-slate-600";
              if (categoryName.includes("Administrasi"))
                colorClass = "text-blue-600";
              else if (categoryName.includes("Topografi"))
                colorClass = "text-emerald-600";
              else if (categoryName.includes("Hidrologi"))
                colorClass = "text-cyan-600";
              else if (categoryName.includes("Geologi"))
                colorClass = "text-amber-600";
              folder = {
                id: folderId,
                name: categoryName,
                color: colorClass,
                maps: [],
              };
              acc.push(folder);
            }
            folder.maps.push(map);
            return acc;
          }, []);
          setFoldersData(grouped);
          if (grouped.length > 0) setActiveFolder(grouped[0].id);
        }
      } catch (error) {
        console.error("Error fetching maps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaps();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolocation");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError("Gagal deteksi lokasi");
        setIsLocating(false);
      }
    );
  };

  const filteredFolders = foldersData
    .map((folder) => ({
      ...folder,
      maps: folder.maps.filter((map) =>
        map.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((f) => f.maps.length > 0);

  const handleMapSelect = (map) => {
    setSelectedMap(map);
    if (window.innerWidth < 768) setIsMobileSidebarOpen(false);
  };

  // Logic: Parse Bounds saat map dipilih
  useEffect(() => {
    if (selectedMap) {
      setMapBounds(getMapBounds(selectedMap));
    }
  }, [selectedMap]);

  // Logic: Hitung Koordinat (Hanya untuk Gambar)
  const handleMouseMove = (e) => {
    if (!mapBounds) return;
    const { offsetWidth, offsetHeight } = e.target;
    const { offsetX, offsetY } = e.nativeEvent;

    const xPercent = offsetX / offsetWidth;
    const yPercent = offsetY / offsetHeight;

    const n = parseFloat(mapBounds.n);
    const s = parseFloat(mapBounds.s);
    const e_lng = parseFloat(mapBounds.e);
    const w = parseFloat(mapBounds.w);

    if (!isNaN(n) && !isNaN(s) && !isNaN(e_lng) && !isNaN(w)) {
      const lat = n - (n - s) * yPercent;
      const lng = w + (e_lng - w) * xPercent;
      setCursorCoord({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    }
  };

  const handleMouseLeave = () => {
    setCursorCoord(null);
  };

  return (
    <div className="flex h-screen bg-[#f9fafe] font-sans overflow-hidden text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden flex-none h-16 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 z-40 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Icon path={icons.menu} className="w-6 h-6" />
          </button>
          <span className="font-bold text-[#3F5F9A] text-lg">GIS Balwana</span>
        </div>
        <div className="bg-[#3F5F9A]/10 text-[#3F5F9A] p-2 rounded-lg">
          <Icon path={icons.map} className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
            isMobileSidebarOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full md:translate-x-0"
          } ${isSidebarOpen ? "md:w-80" : "md:w-20"}`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-none">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2 text-[#3F5F9A] font-bold text-xl ml-2">
                <Icon path={icons.map} className="w-6 h-6" />
                <span>Peta Digital</span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <Icon path={icons.map} className="w-6 h-6 text-[#3F5F9A]" />
              </div>
            )}
            <button
              onClick={() =>
                isMobileSidebarOpen
                  ? setIsMobileSidebarOpen(false)
                  : setIsSidebarOpen(!isSidebarOpen)
              }
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
            >
              <Icon
                path={
                  isMobileSidebarOpen
                    ? icons.x
                    : isSidebarOpen
                    ? icons.chevronLeft
                    : icons.chevronRight
                }
                className="w-5 h-5"
              />
            </button>
          </div>

          {isSidebarOpen && (
            <div className="p-4">
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Icon path={icons.search} className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Cari peta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3F5F9A]"
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Loading...
              </div>
            ) : (
              filteredFolders.map((folder) => (
                <div key={folder.id}>
                  <button
                    onClick={() =>
                      setActiveFolder(
                        activeFolder === folder.id ? null : folder.id
                      )
                    }
                    className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group ${
                      !isSidebarOpen && "justify-center"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={folder.color}>
                        <Icon
                          path={
                            activeFolder === folder.id
                              ? icons.folderOpen
                              : icons.folder
                          }
                          className="w-5 h-5"
                        />
                      </span>
                      {isSidebarOpen && (
                        <span className="font-medium text-gray-700">
                          {folder.name}
                        </span>
                      )}
                    </div>
                    {isSidebarOpen && (
                      <Icon
                        path={icons.chevronDown}
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          activeFolder === folder.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {activeFolder === folder.id && isSidebarOpen && (
                    <div className="ml-4 border-l-2 border-gray-100 pl-3 mt-1 space-y-1">
                      {folder.maps.map((map) => (
                        <button
                          key={map.id}
                          onClick={() => handleMapSelect(map)}
                          className={`w-full text-left p-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                            selectedMap?.id === map.id
                              ? "bg-[#3F5F9A]/10 text-[#3F5F9A] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {map.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex-none">
            {locationError && isSidebarOpen && (
              <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                {locationError}
              </div>
            )}
            <button
              onClick={getUserLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 p-3 bg-[#3F5F9A] text-white rounded-xl font-medium"
            >
              {isLocating ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon path={icons.navigation} className="w-4 h-4" />
              )}
              {isSidebarOpen && (
                <span>{isLocating ? "Mendeteksi..." : "Lokasi Saya"}</span>
              )}
            </button>
            {isSidebarOpen && userLocation && (
              <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400">
                  Lat: {userLocation.lat.toFixed(4)}, Lng:{" "}
                  {userLocation.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </aside>
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        {/* --- MAP VIEWER AREA --- */}
        <div className="flex-1 relative bg-gray-100 flex flex-col">
          {selectedMap ? (
            <div className="absolute inset-4 md:inset-6 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Header Map */}
              <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {selectedMap.title}
                  </h2>
                  <div className="text-xs text-gray-500 flex gap-2 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {selectedMap.category}
                    </span>
                    {selectedMap.fileSize && (
                      <span>{selectedMap.fileSize}</span>
                    )}
                  </div>
                </div>
                <a
                  href={getFileUrl(selectedMap.fileUrl)}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#3F5F9A] text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Icon path={icons.download} className="w-4 h-4" />{" "}
                  <span className="hidden sm:inline">Unduh</span>
                </a>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "radial-gradient(#3F5F9A 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                {isPdf(selectedMap.fileUrl) ? (
                  <GeoreferencedPDFViewer
                    pdfUrl={getFileUrl(selectedMap.fileUrl)}
                    bounds={getMapBounds(selectedMap)}
                  />
                ) : (
                  /* IMAGE VIEWER */
                  <div className="relative w-full h-full flex items-center justify-center">
                    {isImageFile(selectedMap.fileUrl) ? (
                      <>
                        <img
                          src={getFileUrl(selectedMap.fileUrl)}
                          alt="Map"
                          className="max-w-full max-h-full object-contain cursor-crosshair shadow-2xl"
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        />

                        {/* Coordinate Tooltip */}
                        {cursorCoord && (
                          <div className="absolute bottom-6 left-6 z-50 bg-black/80 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-xl pointer-events-none">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider">
                              KOORDINAT
                            </div>
                            <div className="font-mono text-sm grid grid-cols-1 gap-0.5">
                              <div className="flex gap-2">
                                <span className="text-emerald-400 w-8">
                                  LAT
                                </span>{" "}
                                <span>{cursorCoord.lat}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-cyan-400 w-8">LNG</span>{" "}
                                <span>{cursorCoord.lng}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-slate-400">
                        <Icon
                          path={icons.fileText}
                          className="w-12 h-12 mx-auto mb-2"
                        />
                        <p>Preview tidak tersedia. Silakan unduh file.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Indikator Lokasi User (FIXED) */}
                {userLocation && (
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-3 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-20">
                    <div className="relative">
                      <span className="absolute -inset-1 rounded-full bg-green-500/30 animate-ping"></span>
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white relative z-10"></div>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">
                        Lokasi Anda Aktif
                      </p>
                      <p className="text-gray-500">Akurasi tinggi</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
                <Icon path={icons.map} className="w-10 h-10 text-[#3F5F9A]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pilih Peta Digital
              </h2>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                Silakan pilih peta dari menu direktori.
              </p>
              <button
                onClick={() => {
                  setIsSidebarOpen(true);
                  setIsMobileSidebarOpen(true);
                }}
                className="mt-6 md:hidden px-6 py-2 bg-[#3F5F9A] text-white rounded-full font-medium"
              >
                Buka Direktori
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GISPage;
