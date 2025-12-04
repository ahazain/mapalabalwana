import React, { useState, useEffect } from "react";
import api from "../../services/Api";

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
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </>
  ),
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [currentUser, setCurrentUser] = useState({ email: "" });
  const [orgData, setOrgData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
  });
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));

    const fetchSettings = async () => {
      try {
        const response = await api.getSettings();
        if (response.data.status) setOrgData(response.data.data);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveOrg = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(orgData);
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword)
      return alert("Konfirmasi password tidak cocok!");
    try {
      await api.updatePassword({
        email: currentUser.email,
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword,
      });
      alert("Password berhasil diubah! Silakan login ulang.");
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      alert(
        "Gagal mengubah password. " + (error.response?.data?.message || "")
      );
    }
  };

  const tabs = [
    { id: "general", label: "Umum", icon: "settings" },
    { id: "social", label: "Media Sosial", icon: "globe" },
    { id: "account", label: "Akun & Keamanan", icon: "lock" },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafe] font-sans text-slate-800 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 text-sm">
          Konfigurasi website dan informasi organisasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-[#3F5F9A] border-[#3F5F9A]"
                    : "text-slate-600 hover:bg-slate-50 border-transparent"
                }`}
              >
                <Icon path={icons[tab.icon]} className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            {activeTab === "general" && (
              <form onSubmit={handleSaveOrg} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Organisasi
                      </label>
                      <input
                        type="text"
                        value={orgData.name || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={orgData.email || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Alamat Sekretariat
                      </label>
                      <textarea
                        rows="3"
                        value={orgData.address || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, address: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nomor Telepon / WA
                      </label>
                      <input
                        type="text"
                        value={orgData.phone || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#3F5F9A] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <Icon path={icons.save} className="w-4 h-4" /> Simpan
                    Perubahan
                  </button>
                </div>
              </form>
            )}
            {activeTab === "social" && (
              <form onSubmit={handleSaveOrg} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                    Tautan Media Sosial
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={orgData.instagram || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, instagram: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        value={orgData.facebook || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, facebook: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Twitter/X URL
                      </label>
                      <input
                        type="text"
                        value={orgData.twitter || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, twitter: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        YouTube Channel
                      </label>
                      <input
                        type="text"
                        value={orgData.youtube || ""}
                        onChange={(e) =>
                          setOrgData({ ...orgData, youtube: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#3F5F9A] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <Icon path={icons.save} className="w-4 h-4" /> Simpan
                    Perubahan
                  </button>
                </div>
              </form>
            )}
            {activeTab === "account" && (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                    Keamanan Akun Admin
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Admin
                      </label>
                      <input
                        type="email"
                        value={currentUser.email}
                        disabled
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        value={passData.oldPassword}
                        onChange={(e) =>
                          setPassData({
                            ...passData,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={passData.newPassword}
                        onChange={(e) =>
                          setPassData({
                            ...passData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        value={passData.confirmPassword}
                        onChange={(e) =>
                          setPassData({
                            ...passData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#3F5F9A]"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#3F5F9A] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <Icon path={icons.save} className="w-4 h-4" /> Update
                    Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
