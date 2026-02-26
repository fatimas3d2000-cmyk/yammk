"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Loading() {
  return (
    <div
      dir="rtl"
      className={`min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-white flex items-center justify-center ${cairo.className}`}
    >
      {/* Loading Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-2 shadow-2xl">
            <Image
              src="/ggg (1).jpg"
              alt="شعار يمك العافية"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">
            يمك العافية
          </h1>
          <p className="text-gray-600 text-sm">جاري تحميل التطبيق...</p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden shadow-lg">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full animate-[slideInOut_2s_ease-in-out_infinite]"></div>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-500 text-xs">
          يرجى الانتظار...
        </p>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-center max-w-md">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">⚡</div>
            <p className="text-xs text-gray-600">سريع</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">🛡️</div>
            <p className="text-xs text-gray-600">آمن</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">✨</div>
            <p className="text-xs text-gray-600">احترافي</p>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes slideInOut {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
