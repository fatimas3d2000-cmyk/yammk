"use client";

import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

interface ToolbarProps {
  darkMode: boolean;
  language: string;
}

export default function Toolbar({ darkMode, language }: ToolbarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t-2 ${
        darkMode
          ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
          : "border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
      } shadow-2xl`}
    >
      <div className="flex items-center justify-around px-4 py-4">
        {/* Home */}
        <button className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-4 py-3 transition-all hover:bg-white/30 active:scale-95">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-semibold text-white">
            {language === "ar" ? "الرئيسية" : "Home"}
          </span>
        </button>

        {/* Bookings */}
        <button className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-4 py-3 transition-all hover:bg-white/30 active:scale-95">
          <span className="text-2xl">📅</span>
          <span className="text-xs font-semibold text-white">
            {language === "ar" ? "الحجوزات" : "Bookings"}
          </span>
        </button>

        {/* Search */}
        <button className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-4 py-3 transition-all hover:bg-white/30 active:scale-95">
          <span className="text-2xl">🔍</span>
          <span className="text-xs font-semibold text-white">
            {language === "ar" ? "البحث" : "Search"}
          </span>
        </button>

        {/* Messages */}
        <button className="relative flex flex-col items-center gap-1 rounded-xl bg-white/20 px-4 py-3 transition-all hover:bg-white/30 active:scale-95">
          <span className="text-2xl">💬</span>
          <span className="text-xs font-semibold text-white">
            {language === "ar" ? "الرسائل" : "Messages"}
          </span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Settings */}
        <button className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-4 py-3 transition-all hover:bg-white/30 active:scale-95">
          <span className="text-2xl">⚙️</span>
          <span className="text-xs font-semibold text-white">
            {language === "ar" ? "الإعدادات" : "Settings"}
          </span>
        </button>
      </div>
    </div>
  );
}
