"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getProviderNotifications,
  markNotificationAsRead,
  getProviderRatings,
  calculateAverageRating,
  deleteNotification,
  clearAllNotifications,
} from "@/lib/notifications";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function NotificationsPage() {
  const router = useRouter();
  const [providerId, setProviderId] = useState<string>("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userType, setUserType] = useState("provider");
  const [selectedTab, setSelectedTab] = useState<"notifications" | "ratings">(
    "notifications"
  );
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Ensure we're on client side
    if (typeof window === "undefined") return;

    const providerAuth = localStorage.getItem("providerAuth");
    const patientAuth = localStorage.getItem("patientAuth");

    if (!providerAuth && !patientAuth) {
      router.push("/provider-login");
      return;
    }

    let actualProviderId = "";

    if (providerAuth) {
      const parsed = JSON.parse(providerAuth);
      actualProviderId = parsed.email || "default";
      setProviderId(parsed.email || "default");
      setUserType("provider");
      
      // Get notifications and ratings with the actual provider ID
      const notifs = getProviderNotifications(actualProviderId);
      const prov_ratings = getProviderRatings(actualProviderId);
      const avg = calculateAverageRating(actualProviderId);

      setNotifications(notifs);
      setRatings(prov_ratings);
      setAverageRating(avg);
    } else if (patientAuth) {
      setUserType("patient");
      router.push("/");
      return;
    }
  }, [router]);

  const handleMarkAsRead = (notificationId: string) => {
    // Get provider ID from localStorage if state is not set
    let currentProviderId = providerId;
    
    if (!currentProviderId) {
      const providerAuth = localStorage.getItem("providerAuth");
      if (providerAuth) {
        const parsed = JSON.parse(providerAuth);
        currentProviderId = parsed.email || "";
      }
    }

    if (!currentProviderId) return;

    markNotificationAsRead(currentProviderId, notificationId);
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    // Get provider ID from localStorage if state is not set
    let currentProviderId = providerId;
    
    if (!currentProviderId) {
      const providerAuth = localStorage.getItem("providerAuth");
      if (providerAuth) {
        const parsed = JSON.parse(providerAuth);
        currentProviderId = parsed.email || "";
      }
    }

    if (!currentProviderId) {
      alert("خطأ: معرف المزود غير متاح");
      return;
    }

    deleteNotification(currentProviderId, notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const handleClearAllNotifications = () => {
    // Get provider ID from localStorage if state is not set
    let currentProviderId = providerId;
    
    if (!currentProviderId) {
      const providerAuth = localStorage.getItem("providerAuth");
      if (providerAuth) {
        const parsed = JSON.parse(providerAuth);
        currentProviderId = parsed.email || "";
      }
    }

    if (!currentProviderId) {
      alert("خطأ: معرف المزود غير متاح");
      console.error("providerId is empty:", currentProviderId);
      return;
    }

    if (window.confirm("هل أنت متأكد من حذف جميع الإخطارات؟")) {
      const success = clearAllNotifications(currentProviderId);
      if (success) {
        setNotifications([]);
        alert("✓ تم حذف جميع الإخطارات بنجاح");
      } else {
        alert("❌ فشل حذف الإخطارات");
        console.error("Failed to clear notifications");
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      dir="rtl"
      className={`min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-white ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b-2 border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-xl">
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            الإخطارات والتقييمات
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Tab Navigation ===== */}
      <div className="sticky top-20 z-40 bg-white border-b-2 border-blue-100 px-6 py-0">
        <div className="flex gap-0">
          <button
            onClick={() => setSelectedTab("notifications")}
            className={`flex-1 py-4 font-bold transition-all ${
              selectedTab === "notifications"
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              🔔 الإخطارات
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("ratings")}
            className={`flex-1 py-4 font-bold transition-all ${
              selectedTab === "ratings"
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              ⭐ التقييمات ({ratings.length})
            </span>
          </button>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-20">
        {selectedTab === "notifications" ? (
          <div>
            {/* Delete All Button */}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAllNotifications}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold text-sm"
              >
                🗑️ حذف جميع الإخطارات
              </button>
            )}

            {/* Notifications Tab */}
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">📭</span>
                <p className="text-gray-600 text-lg">لا توجد إخطارات حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-5 rounded-2xl transition-all ${
                      notification.read
                        ? "bg-gray-100 border-2 border-gray-200"
                        : "bg-white border-2 border-blue-400 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 cursor-pointer" onClick={() => handleMarkAsRead(notification.id)}>
                        <h3 className="font-bold text-gray-800">
                          {notification.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {!notification.read && (
                          <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></span>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all text-sm font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    {notification.rating && (
                      <div className="mb-3 inline-block">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ {notification.rating} / 5
                        </span>
                      </div>
                    )}

                    {/* Message */}
                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    {/* Patient Info */}
                    {notification.fromPatient && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600">
                          من: <span className="font-bold">{notification.fromPatient}</span>
                        </p>
                        {notification.fromPatientEmail && (
                          <p className="text-xs text-gray-500">
                            {notification.fromPatientEmail}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Comment */}
                    {notification.comment && (
                      <div className="mb-3 p-3 bg-gray-100 rounded-xl">
                        <p className="text-sm text-gray-700">
                          {notification.comment}
                        </p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleDateString(
                        "ar-SA"
                      )}{" "}
                      {new Date(notification.timestamp).toLocaleTimeString(
                        "ar-SA"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Ratings Tab */}
            {/* ===== Summary Card ===== */}
            <div className="p-6 bg-white rounded-2xl shadow-lg mb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl">⭐</span>
              </div>
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                {averageRating.toFixed(1)} / 5.0
              </h2>
              <p className="text-gray-600 mb-3">متوسط التقييم</p>
              <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {ratings.length}
                  </p>
                  <p className="text-gray-600">إجمالي التقييمات</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {ratings.filter((r) => r.rating >= 4).length}
                  </p>
                  <p className="text-gray-600">تقييمات إيجابية</p>
                </div>
              </div>
            </div>

            {/* ===== Rating List ===== */}
            {ratings.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">📊</span>
                <p className="text-gray-600 text-lg">لا توجد تقييمات حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="p-5 bg-white rounded-2xl shadow-md">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800">
                        {rating.patientName}
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        ⭐ {rating.rating} / 5
                      </span>
                    </div>

                    {/* Patient Email */}
                    <p className="text-xs text-gray-500 mb-2">
                      {rating.patientEmail}
                    </p>

                    {/* Comment */}
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {rating.comment}
                    </p>

                    {/* Date */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        {new Date(rating.timestamp).toLocaleDateString(
                          "ar-SA"
                        )}
                      </p>
                      {/* Rating Level */}
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          rating.rating >= 4
                            ? "bg-green-100 text-green-700"
                            : rating.rating >= 3
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {rating.rating >= 4
                          ? "ممتاز"
                          : rating.rating >= 3
                          ? "جيد"
                          : "يحتاج تحسين"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
