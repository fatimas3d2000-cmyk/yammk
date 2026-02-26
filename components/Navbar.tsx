"use client";

import { Cairo } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

interface NavbarProps {
  darkMode: boolean;
  language: string;
  providerAuth: any;
  onLogout?: () => void;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

export default function Navbar({
  darkMode,
  language,
  providerAuth,
  onLogout,
  onMenuClick,
  onNotificationClick,
}: NavbarProps) {
  const router = useRouter();

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        darkMode
          ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900"
          : "border-blue-200 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
      } shadow-lg`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-lg bg-white/20 p-2 transition-all hover:bg-white/30 active:scale-95"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-white">
          {language === "ar" ? "يمك العافية" : "Yamak"}
        </h1>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative flex items-center justify-center rounded-lg bg-white/20 p-2 transition-all hover:bg-white/30 active:scale-95"
        >
          <span className="text-2xl">🔔</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </div>
    </header>
  );
}
