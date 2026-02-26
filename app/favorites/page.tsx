"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import PatientBottomNav from "@/components/PatientBottomNav";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Favorites() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [providerAuth, setProviderAuth] = useState<any>(null);
  const [favorites, setFavorites] = useState([
    { id: 1, name: "أحمد محمد", role: "ممرض منزلي", icon: "💙", rating: 4.9, reviews: 156 },
    { id: 2, name: "مختبر الأمل", role: "فحوصات مختبرية", icon: "🧪", rating: 4.8, reviews: 298 },
    { id: 3, name: "سارة أحمد", role: "معالجة فيزيائية", icon: "🧘", rating: 4.7, reviews: 142 },
  ]);

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (auth) {
      try {
        setProviderAuth(JSON.parse(auth));
      } catch (e) {
        console.error("Error parsing provider auth:", e);
      }
    }

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "darkMode" && e.newValue) {
        setDarkMode(JSON.parse(e.newValue));
      }
      if (e.key === "language" && e.newValue) {
        setLanguage(e.newValue);
      }
    });
  }, []);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" : "border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{t("favorites", language)}</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-32">
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                      <span className="text-3xl">{favorite.icon}</span>
                    </div>
                    <div className="text-right">
                      <h4 className="text-lg font-bold text-gray-800">{favorite.name}</h4>
                      <p className="text-sm text-gray-600">{favorite.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-2xl transition-all transform hover:scale-110 active:scale-95"
                  >
                    ❤️
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-200">
                  <span className="text-yellow-500">⭐ {favorite.rating}</span>
                  <span className="text-gray-600">({favorite.reviews} تقييم)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push(`/booking?provider=${favorite.name}`)}
                    className="py-2 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-all"
                  >
                    حجز الآن
                  </button>
                  <button className="py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                    الملف الشخصي
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">❤️</span>
            <p className="text-gray-600 text-lg mb-4">{t("noFavorites", language)}</p>
            <button
              onClick={() => router.push("/search")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              ابحث عن خدمات
            </button>
          </div>
        )}
      </div>

      {/* ===== Bottom Navigation ===== */}
      <PatientBottomNav language={language} />

      {/* Provider Bottom Navigation */}
      {providerAuth?.isLoggedIn && <ProviderBottomNav language={language} />}
      <div className="h-20"></div>
    </div>
  );
}
