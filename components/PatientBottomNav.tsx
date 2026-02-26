"use client";

import { useRouter } from "next/navigation";

interface PatientBottomNavProps {
  language: string;
}

export default function PatientBottomNav({ language }: PatientBottomNavProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-2xl z-40">
      <div className="flex justify-around items-center px-2 py-3">
        <button 
          onClick={() => router.push("/")}
          className="flex flex-col items-center gap-1 text-white font-semibold hover:opacity-80 transition"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs">{language === "ar" ? "الرئيسية" : "Home"}</span>
        </button>
        <button
          onClick={() => router.push("/search")}
          className="flex flex-col items-center gap-1 text-white hover:opacity-80 transition"
        >
          <span className="text-2xl">🔍</span>
          <span className="text-xs">{language === "ar" ? "البحث" : "Search"}</span>
        </button>
        <button
          onClick={() => router.push("/favorites")}
          className="flex flex-col items-center gap-1 text-white hover:opacity-80 transition"
        >
          <span className="text-2xl">❤️</span>
          <span className="text-xs">{language === "ar" ? "المفضلة" : "Favorites"}</span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center gap-1 text-white hover:opacity-80 transition"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-xs">{language === "ar" ? "الإعدادات" : "Settings"}</span>
        </button>
      </div>
    </div>
  );
}
