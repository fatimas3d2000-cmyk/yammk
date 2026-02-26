"use client";

import { Cairo } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Notifications from "@/components/Notifications";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaInstagram,
  FaLinkedin,
  FaBluetooth,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Home() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [providerAuth, setProviderAuth] = useState<any>(null);
  const [patientAuth, setPatientAuth] = useState<any>(null);
  const [providerChoiceModal, setProviderChoiceModal] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  // Check provider authentication and load preferences on mount
  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Load language preference
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load provider auth
    const auth = localStorage.getItem("providerAuth");
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        setProviderAuth(parsedAuth);
      } catch (e) {
        console.error("Error parsing provider auth:", e);
      }
    }

    // Load patient auth
    const patientAuthData = localStorage.getItem("patientAuth");
    if (patientAuthData) {
      try {
        const parsedPatientAuth = JSON.parse(patientAuthData);
        setPatientAuth(parsedPatientAuth);
      } catch (e) {
        console.error("Error parsing patient auth:", e);
      }
    }

    // Listen for storage changes (from other tabs/windows)
    window.addEventListener("storage", (e) => {
      if (e.key === "darkMode" && e.newValue) {
        setDarkMode(JSON.parse(e.newValue));
      }
      if (e.key === "language" && e.newValue) {
        setLanguage(e.newValue);
      }
    });
  }, [router]);

  // Handle provider button click
  const handleProviderClick = () => {
    if (providerAuth?.isLoggedIn) {
      // Open provider dashboard with the provider type
      const providerType = Object.keys({1: "طبيب", 2: "ممرض", 3: "معالج فيزيائي", 4: "فني مختبر"}).find(
        key => Object.values({1: "طبيب", 2: "ممرض", 3: "معالج فيزيائي", 4: "فني مختبر"})[parseInt(key) - 1] === providerAuth.providerType
      ) || "1";
      router.push("/provider-registration?type=" + providerType);
    } else {
      // Show choice modal
      setProviderChoiceModal(true);
    }
  };

  // بيانات الطلبات والتنبيهات
  const notifications = [
    {
      id: 1,
      type: "booking",
      title: "تم قبول طلبك",
      description: "تمريض منزلي - محمد أحمد",
      status: "قبول",
      statusColor: "bg-green-100 text-green-700",
      date: "29 يناير 2026",
      time: "14:30",
      icon: "✅"
    },
    {
      id: 2,
      type: "booking",
      title: "طلب جديد تم استقباله",
      description: "فحوصات مختبرية - فاطمة علي",
      status: "جديد",
      statusColor: "bg-blue-100 text-blue-700",
      date: "29 يناير 2026",
      time: "15:00",
      icon: "📋"
    },
    {
      id: 3,
      type: "booking",
      title: "تم رفض طلبك",
      description: "علاج فيزيائي - حسين محمود",
      status: "رفض",
      statusColor: "bg-red-100 text-red-700",
      date: "28 يناير 2026",
      time: "10:30",
      icon: "❌"
    },
    {
      id: 4,
      type: "booking",
      title: "تم قبول طلبك",
      description: "تغيير الضمادات - سارة محمود",
      status: "قبول",
      statusColor: "bg-green-100 text-green-700",
      date: "28 يناير 2026",
      time: "09:15",
      icon: "✅"
    },
    {
      id: 5,
      type: "booking",
      title: "طلب جديد تم استقباله",
      description: "إسعافات أولية - علي خالد",
      status: "جديد",
      statusColor: "bg-blue-100 text-blue-700",
      date: "27 يناير 2026",
      time: "16:45",
      icon: "📋"
    }
  ];

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        language={language}
        providerAuth={providerAuth}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotificationClick={() => setNotificationsOpen(!notificationsOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        language={language}
        providerAuth={providerAuth}
      />

      {/* Notifications */}
      <Notifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        darkMode={darkMode}
        language={language}
      />

      {/* Main Content */}
      <div className="mt-[70px] pb-6">
        {/* ===== Welcome Banner ===== */}
        <div className="px-6 pt-8 pb-4">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-0.5 shadow-2xl overflow-hidden">
            <div className="relative bg-white rounded-3xl overflow-hidden">
              <Image
                src="/fff.jpg"
                alt="مرحبا بك في يمك العافية"
                width={800}
                height={350}
                priority
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold drop-shadow-lg">مرحباً بك</h2>
                <p className="text-sm drop-shadow-lg">اختر دورك للبدء</p>
              </div>
            </div>
          </div>
        </div>
        {/* ===== Main Options ===== */}
        <div className="space-y-5 px-6 py-6">
          {/* Patient Option - Show only if no one is logged in */}
          {!patientAuth?.isLoggedIn && !providerAuth?.isLoggedIn && (
            <button
              onClick={() => {
                router.push("/patient-login");
              }}
              className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 shadow-2xl"></div>
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>

            <div className="relative flex items-center gap-5 px-6 py-5">
              <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md p-5">
                <span className="text-5xl">🩺</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-white mb-1">أنا مريض</h3>
                <p className="text-white/85 text-sm">طلب خدمة صحية</p>
              </div>
              <div className="flex-shrink-0 text-white/60">
                <span className="text-2xl">›</span>
              </div>
            </div>
            </button>
          )}

          {/* Patient Dashboard - Show if patient is logged in */}
          {patientAuth?.isLoggedIn && (
            <button
              onClick={() => router.push("/second-page")}
              className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 shadow-2xl"></div>
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>

            <div className="relative flex items-center gap-5 px-6 py-5">
              <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md p-5">
                <span className="text-5xl">🏥</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-white mb-1">حسابي</h3>
                <p className="text-white/85 text-sm">لوحة التحكم الشخصية</p>
              </div>
              <div className="flex-shrink-0 text-white/60">
                <span className="text-2xl">›</span>
              </div>
            </div>
            </button>
          )}

          {/* Healthcare Provider Option */}
          {!patientAuth?.isLoggedIn && (
            <button
              onClick={handleProviderClick}
              className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-2xl"></div>
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative flex items-center gap-5 px-6 py-5">
              <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md p-5">
                <span className="text-5xl">👨‍⚕️</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-white mb-1">{providerAuth?.isLoggedIn ? "لوحة التحكم" : "أقدم رعاية صحية"}</h3>
                <p className="text-white/85 text-sm">{providerAuth?.isLoggedIn ? "إدارة خدماتك" : "تقديم الخدمات الطبية"}</p>
              </div>
              <div className="flex-shrink-0 text-white/60">
                <span className="text-2xl">›</span>
              </div>
            </div>
            </button>
          )}

          {/* Patient Logout Button - Show if patient is logged in */}
          {patientAuth?.isLoggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem("patientAuth");
                setPatientAuth(null);
                router.push("/");
              }}
              className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-2xl"></div>
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative flex items-center gap-5 px-6 py-5">
              <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md p-5">
                <span className="text-5xl">🚪</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-white mb-1">تسجيل الخروج</h3>
                <p className="text-white/85 text-sm">الخروج من حسابك</p>
              </div>
              <div className="flex-shrink-0 text-white/60">
                <span className="text-2xl">›</span>
              </div>
            </div>
            </button>
          )}

          {/* Provider Logout Button - Show if provider is logged in and patient is not */}
          {providerAuth?.isLoggedIn && !patientAuth?.isLoggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem("providerAuth");
                setProviderAuth(null);
                router.push("/");
              }}
              className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-2xl"></div>
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative flex items-center gap-5 px-6 py-5">
              <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-md p-5">
                <span className="text-5xl">🚪</span>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-white mb-1">تسجيل الخروج</h3>
                <p className="text-white/85 text-sm">الخروج من حسابك</p>
              </div>
              <div className="flex-shrink-0 text-white/60">
                <span className="text-2xl">›</span>
              </div>
            </div>
            </button>
          )}
        </div>

        {/* ===== Provider Bookings Section ===== */}
        {providerAuth?.isLoggedIn && (
          <div className="px-6 py-8">
            <h3 className={`text-xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-5 text-center`}>
              الطلبات المقبولة
            </h3>
            <div className="space-y-4">
              {/* Booking 1 */}
              <button
                onClick={() => router.push("/my-orders")}
                className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-600 shadow-lg"></div>
                <div className={`relative flex items-center gap-4 px-5 py-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl`}>
                  <span className="text-3xl">🩺</span>
                  <div className="flex-1 text-right">
                    <h4 className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>محمد أحمد</h4>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>تمريض منزلي - 29 يناير</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">مقبول</div>
                </div>
              </button>

              {/* Booking 2 */}
              <button
                onClick={() => router.push("/my-orders")}
                className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg"></div>
                <div className={`relative flex items-center gap-4 px-5 py-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl`}>
                  <span className="text-3xl">🧪</span>
                  <div className="flex-1 text-right">
                    <h4 className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>مختبر الأمل الطبي</h4>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>فحوصات مختبرية - 31 يناير</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">مقبول</div>
                </div>
              </button>

              {/* Booking 3 */}
              <button
                onClick={() => router.push("/my-orders")}
                className="w-full group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg"></div>
                <div className={`relative flex items-center gap-4 px-5 py-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl`}>
                  <span className="text-3xl">🧘</span>
                  <div className="flex-1 text-right">
                    <h4 className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>علي الحسيني</h4>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>علاج فيزيائي - 1 فبراير</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">مقبول</div>
                </div>
              </button>

              {/* View All Button */}
              <button
                onClick={() => router.push("/my-orders")}
                className={`w-full py-3 rounded-xl font-bold transition-all mt-2 ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
              >
                عرض جميع الطلبات
              </button>
            </div>
          </div>
        )}

        {/* ===== Why Choose Us Section ===== */}
        <div className="px-6 py-8">
        <h4 className="text-xl font-bold text-gray-800 mb-5 text-center">
          لماذا تختارنا؟
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-5 text-center hover:shadow-lg transition-all">
            <span className="text-4xl mb-3 block">⚡</span>
            <p className="text-sm font-bold text-blue-900">سريع وفعال</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-5 text-center hover:shadow-lg transition-all">
            <span className="text-4xl mb-3 block">🛡️</span>
            <p className="text-sm font-bold text-green-900">آمن وموثوق</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-5 text-center hover:shadow-lg transition-all">
            <span className="text-4xl mb-3 block">🏥</span>
            <p className="text-sm font-bold text-purple-900">متخصصون</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-5 text-center hover:shadow-lg transition-all">
            <span className="text-4xl mb-3 block">📱</span>
            <p className="text-sm font-bold text-orange-900">متاح 24/7</p>
          </div>
        </div>
        </div>
      </div>



      {/* ===== Notifications Overlay ===== */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setNotificationsOpen(false)}
        ></div>
      )}

      {/* ===== Notifications Panel ===== */}
      <div
        className={`fixed top-0 left-0 h-screen w-96 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          notificationsOpen ? "translate-x-0" : "-translate-x-full"
        } ${darkMode ? "bg-gray-900" : "bg-white"}`}
        dir="rtl"
      >
        {/* Notifications Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 flex items-center justify-between">
          <button
            onClick={() => setNotificationsOpen(false)}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">✕</span>
          </button>
          <h2 className="text-xl font-bold">{t("notifications_title", language)} ({notifications.length})</h2>
          <div className="w-10"></div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-r-4 border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{notification.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{notification.title}</h3>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${notification.statusColor}`}>
                        {notification.status}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>{notification.description}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {notification.date} - {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl block mb-3">📭</span>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t("noNotifications", language)}</p>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className={`sticky bottom-0 border-t p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <button className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">
              {t("clearAll", language)}
            </button>
          </div>
        )}
      </div>

      {/* ===== Sidebar Overlay ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ===== Sidebar Menu ===== */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-gray-900" : "bg-white"}`}
        dir="rtl"
      >
        {/* Sidebar Header with Image */}
        <div className="relative h-48 bg-gradient-to-b from-blue-600 to-cyan-500">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-4 flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all text-white"
          >
            <span className="text-2xl">✕</span>
          </button>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Image
                src="/ggg (1).jpg"
                alt="يمك العافية"
                width={80}
                height={80}
                className="rounded-lg shadow-lg inline-block mb-2"
              />
              <p className="text-white font-bold text-lg">{t("healthcare", language)}</p>
              <p className="text-white/80 text-sm">{t("trustworthyPlatform", language)}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="p-6 space-y-4">
          {/* Provider Profile Section */}
          {providerAuth?.isLoggedIn && providerAuth?.provider && (
            <div className={`p-4 rounded-2xl border-2 ${darkMode ? "bg-emerald-900/20 border-emerald-700/50" : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"} mb-6`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{providerAuth.provider.icon}</span>
                <div className="flex-1">
                  <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {providerAuth.provider.firstName} {providerAuth.provider.lastName}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{providerAuth.provider.specialization}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("providerAuth");
                  setProviderAuth(null);
                  setSidebarOpen(false);
                }}
                className="w-full py-2 px-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all text-sm"
              >
                تسجيل الخروج
              </button>
              <div className={`border-b my-4 ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
            </div>
          )}

          {/* Medical Liability Disclaimer */}
          <button
            onClick={() => {
              setPolicyOpen(true);
            }}
            className={`w-full text-right py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold group ${darkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-blue-50"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🔒</span>
            <span>{t("privacyPolicy", language)}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              setShareOpen(true);
            }}
            className={`w-full text-right py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold group ${darkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-green-50"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📤</span>
            <span>{t("shareApp", language)}</span>
          </button>

          {/* Contact Us */}
          <button
            onClick={() => {
              setContactOpen(true);
            }}
            className={`w-full text-right py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold group ${darkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-purple-50"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
            <span>{t("contactUs", language)}</span>
          </button>

          {/* Divider */}
          <div className={`h-px my-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>

          {/* About */}
          <button
            onClick={() => {
              setAboutOpen(true);
            }}
            className={`w-full text-right py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold group ${darkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-orange-50"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">ℹ️</span>
            <span>{t("about", language)}</span>
          </button>

          {/* Rate Us */}
          <button
            onClick={() => {
              setSidebarOpen(false);
              // فتح متجر بلي مباشر للتقييم
              window.open("https://play.google.com/store/apps/details?id=com.healthcare.app", "_blank");
            }}
            className={`w-full text-right py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold group ${darkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-800 hover:bg-yellow-50"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">⭐</span>
            <span>{t("rateApp", language)}</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className={`absolute bottom-0 left-0 right-0 border-t p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <div className="text-center space-y-3">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>يمك العافية</span>
            </p>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>الإصدار 1.0.0</p>
            <div className="flex justify-center gap-3">
              <a href="#" className="text-2xl hover:scale-110 transition-transform">
                📱
              </a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform">
                💬
              </a>
              <a href="#" className="text-2xl hover:scale-110 transition-transform">
                🌐
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Privacy Policy Modal Overlay ===== */}
      {policyOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPolicyOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Policy Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <button
                onClick={() => setPolicyOpen(false)}
                className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
              >
                <span className="text-2xl">✕</span>
              </button>
              <h2 className="text-2xl font-bold">سياسة الخصوصية</h2>
              <div className="w-10"></div>
            </div>

            {/* Policy Content */}
            <div className="p-8 space-y-6" dir="rtl">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">سياسة تجردنا من الأخطاء الطبية</h3>
                <p className="text-gray-700 leading-relaxed">
                  تقدم منصة يمك العافية خدماتها وفقاً لأحكام هذه السياسة وإخلاء المسؤولية القانونية الذي يحكم استخدام المنصة والخدمات الطبية المقدمة عليها.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">1. إقرار المستخدم</h3>
                <p className="text-gray-700 leading-relaxed">
                  بقبولك لشروط الاستخدام، تقر وتعترف بأن المنصة توفر منبراً لتوصيل الخدمات الصحية فقط، وليست مسؤولة بأي حال من الأحوال عن أي أخطاء طبية قد تحدث أثناء تقديم الخدمة من قبل مقدم الخدمة (الطبيب / المتخصص).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">2. المسؤولية القانونية</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  لا تتحمل المنصة أي مسؤولية قانونية عن:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li>• أي أخطاء تشخيصية أو طبية ترتكبها الجهات الطبية</li>
                  <li>• الإهمال الطبي أو سوء التشخيص</li>
                  <li>• أي مضاعفات أو آثار جانبية ناجمة عن العلاج</li>
                  <li>• عدم التزام مقدم الخدمة بمعايير الممارسة الطبية</li>
                  <li>• أي إصابات بدنية أو نفسية ناتجة عن الخدمات الطبية</li>
                  <li>• الوفيات أو المضاعفات الصحية الحادة</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">3. اتفاق المستخدم</h3>
                <p className="text-gray-700 leading-relaxed">
                  باستخدامك للمنصة وطلبك للخدمات الطبية، فأنت توافق بشكل كامل على تحمل كل المخاطر المتعلقة بالخدمات الطبية المقدمة، وتتنازل عن أي حق قانوني في المطالبة بتعويضات من المنصة أو الشركة الأم عن أي أخطاء طبية.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">4. المسؤولية الحصرية للمقدم</h3>
                <p className="text-gray-700 leading-relaxed">
                  يتحمل مقدم الخدمة الطبية (الطبيب / المتخصص) والمؤسسة الطبية التابع لها مسؤولية كاملة وحصرية عن جودة وسلامة الخدمات الطبية المقدمة، وعن أي أخطاء أو إهمال قد يحدث.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">5. عدم تقديم استشارة طبية</h3>
                <p className="text-gray-700 leading-relaxed">
                  المنصة لا تقدم استشارات طبية وليست ملزمة بالتحقق من كفاءة أو مؤهلات مقدمي الخدمات. المستخدم يتحمل مسؤولية اختيار مقدم الخدمة وفهم مؤهلاته وخبرته قبل الاستفادة من خدماته.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">6. إقرار المستخدم بالمخاطر</h3>
                <p className="text-gray-700 leading-relaxed">
                  المستخدم يقر ويعترف بأنه على دراية تامة بجميع المخاطر المحتملة للخدمات الطبية، وأنه قد اتخذ القرار بكامل إرادته واختياره.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">7. الاستثناءات</h3>
                <p className="text-gray-700 leading-relaxed">
                  هذه السياسة تنطبق على جميع الخدمات الطبية بدون استثناء، بما في ذلك الاستشارات والفحوصات والعمليات الجراحية والعلاجات.
                </p>
              </div>

              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800 font-semibold">
                  ⚠️ <strong>ملاحظة قانونية:</strong> بقبول شروط الخدمة وهذه السياسة، أنت تتنازل قانونياً عن جميع حقوقك في المطالبة بتعويضات من المنصة عن أي ضرر ناجم عن الخدمات الطبية.
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 text-center">
                  آخر تحديث: 30 يناير 2026
                </p>
              </div>
            </div>

            {/* Policy Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setPolicyOpen(false)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                أوافق على السياسة
              </button>
              <button
                onClick={() => setPolicyOpen(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Provider Choice Modal Overlay ===== */}
      {providerChoiceModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProviderChoiceModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-8 text-center">
              <span className="text-5xl block mb-3">👨‍⚕️</span>
              <h2 className="text-2xl font-bold">مقدم رعاية صحية</h2>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              <p className="text-gray-700 text-center mb-6">
                هل لديك حساب بالفعل؟
              </p>

              {/* Login Button */}
              <button
                onClick={() => {
                  setProviderChoiceModal(false);
                  router.push("/provider-login");
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
              >
                تسجيل الدخول 🔐
              </button>

              {/* Register Button */}
              <button
                onClick={() => {
                  setProviderChoiceModal(false);
                  router.push("/therd-page");
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
              >
                إنشاء حساب جديد ✨
              </button>

              {/* Close Button */}
              <button
                onClick={() => setProviderChoiceModal(false)}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                إغلاق
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-600">
                اختر إحدى الخيارات أعلاه للمتابعة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Share Modal ===== */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-8 flex items-center justify-between">
              <button
                onClick={() => setShareOpen(false)}
                className="flex items-center justify-center rounded-xl bg-white/20 p-2 hover:bg-white/30 transition-all"
              >
                <span className="text-2xl">✕</span>
              </button>
              <h2 className="text-2xl font-bold">شارك التطبيق</h2>
              <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <p className="text-gray-700 text-center text-lg">
                شارك تطبيق يمك العافية مع أصدقائك وعائلتك
              </p>

              {/* Social Media Sharing */}
              <div className="grid grid-cols-3 gap-4">
                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const text = "انضم إلى تطبيق يمك العافية الموثوق! 🏥 احصل على خدمات طبية متخصصة من الأطباء والممرضين بكل سهولة. https://play.google.com/store/apps/details?id=com.healthcare.app";
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-green-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaWhatsapp className="text-5xl text-green-500" />
                  <span className="text-sm font-bold text-gray-800">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => {
                    window.open("https://www.facebook.com/sharer/sharer.php?u=https://play.google.com/store/apps/details?id=com.healthcare.app", "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-blue-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaFacebook className="text-5xl text-blue-600" />
                  <span className="text-sm font-bold text-gray-800">Facebook</span>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={() => {
                    const text = "انضم إلى تطبيق يمك العافية 🏥 احصل على خدمات طبية متخصصة #الصحة #التطبيقات";
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://play.google.com/store/apps/details?id=com.healthcare.app`, "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-gray-100 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaTwitter className="text-5xl text-gray-900" />
                  <span className="text-sm font-bold text-gray-800">X</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    const text = "انضم إلى تطبيق يمك العافية الموثوق! 🏥 https://play.google.com/store/apps/details?id=com.healthcare.app";
                    window.open(`https://t.me/share/url?url=https://play.google.com/store/apps/details?id=com.healthcare.app&text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-cyan-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaTelegram className="text-5xl text-cyan-500" />
                  <span className="text-sm font-bold text-gray-800">Telegram</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    // Instagram لا يدعم المشاركة المباشرة من الويب
                    window.open("https://www.instagram.com/", "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-pink-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaInstagram className="text-5xl text-pink-600" />
                  <span className="text-sm font-bold text-gray-800">Instagram</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://play.google.com/store/apps/details?id=com.healthcare.app`, "_blank");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-blue-100 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaLinkedin className="text-5xl text-blue-700" />
                  <span className="text-sm font-bold text-gray-800">LinkedIn</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => {
                    const subject = "تطبيق يمك العافية";
                    const body = "انضم إلى تطبيق يمك العافية الموثوق! احصل على خدمات طبية متخصصة من الأطباء والممرضين بكل سهولة.\n\nhttps://play.google.com/store/apps/details?id=com.healthcare.app";
                    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-red-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaEnvelope className="text-5xl text-red-600" />
                  <span className="text-sm font-bold text-gray-800">البريد</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    const link = "https://play.google.com/store/apps/details?id=com.healthcare.app";
                    navigator.clipboard.writeText(link);
                    alert("تم نسخ الرابط! ✓");
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-purple-50 transition-all hover:shadow-lg active:scale-95"
                >
                  <FaLink className="text-5xl text-purple-600" />
                  <span className="text-sm font-bold text-gray-800">الرابط</span>
                </button>
              </div>

              {/* Copy Link */}
              <button
                onClick={() => {
                  const link = "https://play.google.com/store/apps/details?id=com.healthcare.app";
                  navigator.clipboard.writeText(link);
                  alert("تم نسخ الرابط! ✓");
                }}
                className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FaLink />
                <span>نسخ الرابط</span>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setShareOpen(false)}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== About App Modal ===== */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-500 text-white p-8 flex items-center justify-between rounded-t-3xl">
              <button
                onClick={() => setAboutOpen(false)}
                className="flex items-center justify-center rounded-xl bg-white/20 p-2 hover:bg-white/30 transition-all"
              >
                <span className="text-2xl">✕</span>
              </button>
              <h2 className="text-2xl font-bold">{t("about", language)}</h2>
              <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8" dir="rtl">
              {/* App Logo and Title */}
              <div className="text-center">
                <div className="inline-block mb-4">
                  <Image
                    src="/ggg (1).jpg"
                    alt="شعار يمك العافية"
                    width={100}
                    height={100}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">يمك العافية</h3>
                <p className="text-gray-600">الإصدار 1.0.0</p>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <p className="text-gray-700 text-lg leading-relaxed">
                  تطبيق يمك العافية هو منصة موثوقة وآمنة تربط المرضى بأفضل الخدمات الطبية المتخصصة. نوفر خدمات طبية شاملة بكفاءة عالية واحترافية.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✨</span> المميزات الرئيسية
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 p-4 bg-green-50 rounded-xl border-r-4 border-green-500">
                    <span className="text-2xl flex-shrink-0">👨‍⚕️</span>
                    <div>
                      <p className="font-bold text-gray-800">أطباء ومتخصصون معتمدون</p>
                      <p className="text-sm text-gray-600">فريق طبي ذو خبرة عميقة وكفاءة عالية</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-blue-50 rounded-xl border-r-4 border-blue-500">
                    <span className="text-2xl flex-shrink-0">🕐</span>
                    <div>
                      <p className="font-bold text-gray-800">خدمات متاحة 24/7</p>
                      <p className="text-sm text-gray-600">احصل على الرعاية الطبية في أي وقت تحتاجها</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-purple-50 rounded-xl border-r-4 border-purple-500">
                    <span className="text-2xl flex-shrink-0">🏠</span>
                    <div>
                      <p className="font-bold text-gray-800">خدمة منزلية</p>
                      <p className="text-sm text-gray-600">احصل على الخدمات الطبية في منزلك براحة تامة</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-orange-50 rounded-xl border-r-4 border-orange-500">
                    <span className="text-2xl flex-shrink-0">🔒</span>
                    <div>
                      <p className="font-bold text-gray-800">أمان وخصوصية عالية</p>
                      <p className="text-sm text-gray-600">حماية كاملة لبيانات المرضى والسرية الطبية</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-red-50 rounded-xl border-r-4 border-red-500">
                    <span className="text-2xl flex-shrink-0">💰</span>
                    <div>
                      <p className="font-bold text-gray-800">أسعار منافسة</p>
                      <p className="text-sm text-gray-600">أسعار عادلة وخطط دفع مرنة</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-pink-50 rounded-xl border-r-4 border-pink-500">
                    <span className="text-2xl flex-shrink-0">⭐</span>
                    <div>
                      <p className="font-bold text-gray-800">تقييمات عالية</p>
                      <p className="text-sm text-gray-600">4.8 نجوم من آلاف المستخدمين الراضين</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏥</span> الخدمات المقدمة
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">💙</p>
                    <p className="font-bold text-gray-800">تمريض منزلي</p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">🧪</p>
                    <p className="font-bold text-gray-800">فحوصات مختبرية</p>
                  </div>
                  <div className="p-4 bg-emerald-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">🧘</p>
                    <p className="font-bold text-gray-800">علاج فيزيائي</p>
                  </div>
                  <div className="p-4 bg-rose-100 rounded-xl text-center">
                    <p className="text-3xl mb-2">🚑</p>
                    <p className="font-bold text-gray-800">إسعافات أولية</p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💪</span> لماذا تختار تطبيقنا؟
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>سهولة الاستخدام والواجهة الودية</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>تتبع تقدم الحالة الصحية في الوقت الفعلي</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>استشارات طبية فورية مع المتخصصين</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>سجل طبي رقمي آمن وسهل الوصول</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>دعم عملاء متواصل ومساعدة فنية سريعة</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>تطبيق معتمد ومرخص من الجهات الصحية</span>
                  </li>
                </ul>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center space-y-6">
                <h3 className="text-2xl font-bold">إحصائياتنا</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-4xl font-bold">100K+</p>
                    <p className="text-sm">مستخدم نشط</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">50K+</p>
                    <p className="text-sm">عملية طبية</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">500+</p>
                    <p className="text-sm">متخصص طبي</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">تواصل معنا</h3>
                <div className="flex gap-3">
                  <span>📧</span>
                  <a href="mailto:support@healthcare.app" className="text-blue-600 hover:underline">support@healthcare.app</a>
                </div>
                <div className="flex gap-3">
                  <span>📱</span>
                  <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 234 567 890</a>
                </div>
                <div className="flex gap-3">
                  <span>🌐</span>
                  <a href="https://www.healthcare.app" target="_blank" className="text-blue-600 hover:underline">www.healthcare.app</a>
                </div>
                <div className="flex gap-3">
                  <span>📍</span>
                  <span className="text-gray-700">الشرق الأوسط والعالم</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center space-y-2 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600">شكراً لاستخدامك تطبيق يمك العافية</p>
                <p className="text-xs text-gray-500">© 2026 جميع الحقوق محفوظة</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl flex gap-3">
              <button
                onClick={() => setAboutOpen(false)}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Contact Us Modal ===== */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-8 flex items-center justify-between">
              <button
                onClick={() => setContactOpen(false)}
                className="flex items-center justify-center rounded-xl bg-white/20 p-2 hover:bg-white/30 transition-all"
              >
                <span className="text-2xl">✕</span>
              </button>
              <h2 className="text-2xl font-bold">{t("contactUs", language)}</h2>
              <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8" dir="rtl">
              {/* Main Message */}
              <div className="text-center">
                <span className="text-6xl block mb-4">💜</span>
                <p className="text-gray-700 text-lg">
                  نحن هنا لمساعدتك! تواصل معنا بأي وقت
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                {/* Phone Support */}
                <a
                  href="tel:+9641234567890"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:shadow-lg transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <span className="text-4xl">📱</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-lg mb-1">الدعم الهاتفي</p>
                    <p className="text-white/90">+964 123 456 7890</p>
                    <p className="text-xs text-white/70 mt-1">متاح 24/7</p>
                  </div>
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">›</span>
                  </div>
                </a>

                {/* Email Support */}
                <a
                  href="mailto:support@healthcare.app"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-lg transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <span className="text-4xl">✉️</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-lg mb-1">الدعم عبر البريد الإلكتروني</p>
                    <p className="text-white/90">support@healthcare.app</p>
                    <p className="text-xs text-white/70 mt-1">نرد خلال ساعتين</p>
                  </div>
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">›</span>
                  </div>
                </a>

                {/* WhatsApp Support */}
                <a
                  href="https://wa.me/9641234567890"
                  target="_blank"
                  className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all active:scale-95 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <span className="text-4xl">💬</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-lg mb-1">WhatsApp</p>
                    <p className="text-white/90">+964 123 456 7890</p>
                    <p className="text-xs text-white/70 mt-1">رد سريع وفوري</p>
                  </div>
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">›</span>
                  </div>
                </a>
              </div>

              {/* Additional Info */}
              <div className="bg-purple-50 rounded-2xl p-6 border-r-4 border-purple-500 space-y-3">
                <h3 className="font-bold text-gray-800 text-lg">⏱️ ساعات العمل</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>من الأحد إلى الخميس:</span>
                    <span className="font-semibold">8:00 ص - 8:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة والسبت:</span>
                    <span className="font-semibold">10:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>الطوارئ:</span>
                    <span>24/7</span>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-lg">❓ أسئلة شائعة</h3>
                <details className="p-4 bg-gray-50 rounded-xl border border-gray-200 group cursor-pointer">
                  <summary className="font-semibold text-gray-800 flex items-center justify-between">
                    <span>ما هي سرعة الاستجابة؟</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-right">نضمن الاستجابة خلال أقل من ساعة واحدة لجميع الاستفسارات</p>
                </details>

                <details className="p-4 bg-gray-50 rounded-xl border border-gray-200 group cursor-pointer">
                  <summary className="font-semibold text-gray-800 flex items-center justify-between">
                    <span>هل يمكنني تقديم شكوى؟</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-right">نعم، يمكنك تقديم شكواك عبر البريد الإلكتروني أو الهاتف مباشرة</p>
                </details>

                <details className="p-4 bg-gray-50 rounded-xl border border-gray-200 group cursor-pointer">
                  <summary className="font-semibold text-gray-800 flex items-center justify-between">
                    <span>كيف أتابع طلبي؟</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-right">يمكنك متابعة حالة طلبك مباشرة من التطبيق مع تحديثات فورية</p>
                </details>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 text-center">تابعنا على وسائل التواصل</h3>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-3xl hover:scale-110 transition-transform">📱</a>
                  <a href="#" className="text-3xl hover:scale-110 transition-transform">👍</a>
                  <a href="#" className="text-3xl hover:scale-110 transition-transform">𝕏</a>
                  <a href="#" className="text-3xl hover:scale-110 transition-transform">✈️</a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setContactOpen(false)}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Patient - Only show on other pages, not home */}
      {/* Removed from home page as requested */}

      {/* Provider Bottom Navigation */}
      {providerAuth?.isLoggedIn && <ProviderBottomNav language={language} />}

    </div>
  );
}