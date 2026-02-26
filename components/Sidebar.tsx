"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  darkMode: boolean;
  language: string;
  providerAuth: any;
}

export default function Sidebar({
  isOpen,
  onClose,
  darkMode,
  language,
  providerAuth,
}: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: 1, label: language === "ar" ? "لوحة التحكم" : "Dashboard", icon: "📊", path: "/" },
    { id: 2, label: language === "ar" ? "الحجوزات" : "Bookings", icon: "📅", path: "/booking" },
    { id: 3, label: language === "ar" ? "المفضلة" : "Favorites", icon: "❤️", path: "/favorites" },
    { id: 4, label: language === "ar" ? "السجل الطبي" : "Medical History", icon: "📋", path: "/medical-history" },
    { id: 5, label: language === "ar" ? "طلباتي" : "My Orders", icon: "🛒", path: "/my-orders" },
    { id: 6, label: language === "ar" ? "الدفع" : "Payment", icon: "💳", path: "/payment" },
    { id: 7, label: language === "ar" ? "التقييمات" : "Ratings", icon: "⭐", path: "/rating-review" },
    { id: 8, label: language === "ar" ? "الإعدادات" : "Settings", icon: "⚙️", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${
          language === "ar" ? "right-0" : "left-0"
        } z-40 h-screen w-64 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : language === "ar" ? "translate-x-full" : "-translate-x-full"
        } ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700"
            : "bg-gradient-to-b from-blue-50 to-cyan-50 border-l border-blue-200"
        } shadow-2xl`}
      >
        <div className="space-y-4 p-6">
          {/* Header */}
          <div className={`mb-8 flex items-center gap-3 p-4 rounded-xl ${
            darkMode ? "bg-gray-700" : "bg-blue-100"
          }`}>
            <span className="text-3xl">👤</span>
            <div>
              <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {providerAuth?.firstName} {providerAuth?.lastName}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {providerAuth?.providerType || "مقدم خدمة"}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  darkMode
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-blue-200 text-gray-800"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
