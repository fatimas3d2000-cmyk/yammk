"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/translations";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function ProviderServices() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedLanguage = localStorage.getItem("language") || "ar";
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      const newDarkMode = localStorage.getItem("darkMode") === "true";
      const newLanguage = localStorage.getItem("language") || "ar";
      setDarkMode(newDarkMode);
      setLanguage(newLanguage);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const services = [
    {
      id: 2,
      name: "تسجيل ممرض",
      icon: "👩‍⚕️",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      description: "الخدمات التمريضية المتخصصة",
    },
    {
      id: 3,
      name: "معالج فيزيائي",
      icon: "🏃‍♂️",
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      description: "برامج إعادة التأهيل",
    },
    {
      id: 4,
      name: "فني مختبر",
      icon: "🔬",
      color: "from-rose-400 to-rose-600",
      bgColor: "bg-rose-50",
      description: "الفحوصات المختبرية المتقدمة",
    },
  ];

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-b from-emerald-50 via-teal-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gray-800" : "border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">انضم إلينا</h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Hero Banner ===== */}
      <div className="px-6 pt-6 pb-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-xl overflow-hidden">
          <div className="relative bg-white rounded-3xl overflow-hidden">
            <Image
              src="/fff.jpg"
              alt="انضم إلى فريقنا"
              width={800}
              height={300}
              priority
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* ===== Title Section ===== */}
      <div className="px-6 py-6 text-center">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-2`}>{t("selectSpecialty", language)}</h2>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>قدم خدماتك الطبية المتميزة للمرضى</p>
      </div>

      {/* ===== Services Grid ===== */}
      <div className={`px-6 space-y-4 pb-12 ${darkMode ? "bg-gray-900" : ""}`}>
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              setSelectedService(service.id);
              setTimeout(() => router.push(`/provider-registration?type=${service.id}`), 300);
            }}
            className={`w-full rounded-2xl transition-all duration-300 transform overflow-hidden ${
              selectedService === service.id ? "scale-95" : "hover:scale-102 active:scale-95"
            }`}
          >
            <div className={`bg-gradient-to-r ${service.color} shadow-lg rounded-2xl p-0.5`}>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-5`}>
                <div className="flex items-center gap-5">
                  <div className={`flex-shrink-0 flex items-center justify-center rounded-2xl ${service.bgColor} p-4`}>
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-1`}>{service.name}</h3>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{service.description}</p>
                  </div>
                  <div className={`flex-shrink-0 text-2xl ${darkMode ? "text-gray-500" : "text-gray-400"}`}>›</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ===== Info Section ===== */}
      <div className="px-6 py-4">
        <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-5 text-center`}>مميزات الانضمام</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 ${darkMode ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200"} rounded-2xl border text-center`}>
            <span className="text-3xl mb-2 block">💰</span>
            <p className={`text-sm font-bold ${darkMode ? "text-emerald-300" : "text-emerald-900"}`}>دخل إضافي</p>
          </div>
          <div className={`p-4 ${darkMode ? "bg-teal-900/20 border-teal-800" : "bg-teal-50 border-teal-200"} rounded-2xl border text-center`}>
            <span className="text-3xl mb-2 block">🌟</span>
            <p className={`text-sm font-bold ${darkMode ? "text-teal-300" : "text-teal-900"}`}>سمعة ممتازة</p>
          </div>
          <div className={`p-4 ${darkMode ? "bg-cyan-900/20 border-cyan-800" : "bg-cyan-50 border-cyan-200"} rounded-2xl border text-center`}>
            <span className="text-3xl mb-2 block">📱</span>
            <p className={`text-sm font-bold ${darkMode ? "text-cyan-300" : "text-cyan-900"}`}>منصة موثوقة</p>
          </div>
          <div className={`p-4 ${darkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"} rounded-2xl border text-center`}>
            <span className="text-3xl mb-2 block">⏰</span>
            <p className={`text-sm font-bold ${darkMode ? "text-blue-300" : "text-blue-900"}`}>حرية الوقت</p>
          </div>
        </div>
      </div>

    </div>
  );
}
