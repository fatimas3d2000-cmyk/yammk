"use client";

import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

interface NotificationsProps {
  isOpen: boolean;
  onClose?: () => void;
  darkMode: boolean;
  language: string;
}

export default function Notifications({
  isOpen,
  onClose,
  darkMode,
  language,
}: NotificationsProps) {
  const notifications = [
    {
      id: 1,
      type: "booking",
      title: language === "ar" ? "تم قبول طلبك" : "Your request was accepted",
      description: language === "ar" ? "تمريض منزلي - محمد أحمد" : "Home Nursing - Ahmed",
      status: language === "ar" ? "قبول" : "Accepted",
      statusColor: "bg-green-100 text-green-700",
      date: language === "ar" ? "29 يناير 2026" : "Jan 29, 2026",
      time: "14:30",
      icon: "✅"
    },
    {
      id: 2,
      type: "booking",
      title: language === "ar" ? "طلب جديد تم استقباله" : "New request received",
      description: language === "ar" ? "فحوصات مختبرية - فاطمة علي" : "Lab Tests - Fatima",
      status: language === "ar" ? "جديد" : "New",
      statusColor: "bg-blue-100 text-blue-700",
      date: language === "ar" ? "29 يناير 2026" : "Jan 29, 2026",
      time: "15:00",
      icon: "📋"
    },
    {
      id: 3,
      type: "booking",
      title: language === "ar" ? "تم رفض طلبك" : "Your request was rejected",
      description: language === "ar" ? "علاج فيزيائي - حسين محمود" : "Physical Therapy - Hussein",
      status: language === "ar" ? "رفض" : "Rejected",
      statusColor: "bg-red-100 text-red-700",
      date: language === "ar" ? "28 يناير 2026" : "Jan 28, 2026",
      time: "10:30",
      icon: "❌"
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Notifications Panel */}
      <aside
        className={`fixed top-0 ${
          language === "ar" ? "left-0" : "right-0"
        } z-40 h-screen w-80 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : language === "ar" ? "-translate-x-full" : "translate-x-full"
        } ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700"
            : "bg-gradient-to-b from-blue-50 to-cyan-50 border-r border-blue-200"
        } shadow-2xl`}
      >
        <div className="sticky top-0 p-6 border-b"
          style={{
            borderColor: darkMode ? "#374151" : "#93c5fd"
          }}
        >
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            {language === "ar" ? "التنبيهات" : "Notifications"}
          </h2>
        </div>

        {/* Notifications List */}
        <div className="space-y-4 p-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 transition-all ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 border-l-cyan-500"
                  : "bg-white hover:bg-blue-50 border-l-blue-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{notification.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {notification.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${notification.statusColor}`}>
                      {notification.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {notification.description}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {notification.date} • {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
