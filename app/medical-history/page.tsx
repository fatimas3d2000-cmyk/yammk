"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function MedicalHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tests");

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
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">السجل الطبي</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Tabs ===== */}
      <div className="sticky top-20 z-40 flex border-b border-gray-200 bg-white/80 backdrop-blur px-6">
        <button
          onClick={() => setActiveTab("tests")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            activeTab === "tests"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          الفحوصات
        </button>
        <button
          onClick={() => setActiveTab("medicines")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            activeTab === "medicines"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          الأدوية
        </button>
        <button
          onClick={() => setActiveTab("procedures")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            activeTab === "procedures"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          العمليات
        </button>
      </div>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-32">
        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">📊</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">تحليل الدم الشامل</h4>
                  <p className="text-sm text-gray-600">20 يناير 2026</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2"><strong>النتائج:</strong></p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• الهيموجلوبين: 14.5 g/dL ✓</li>
                  <li>• كرات الدم البيضاء: 7.2 K/uL ✓</li>
                  <li>• الصفائح الدموية: 250 K/uL ✓</li>
                </ul>
              </div>
              <button className="w-full py-2 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-all">
                عرض التقرير الكامل
              </button>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">📋</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">تحليل البول</h4>
                  <p className="text-sm text-gray-600">15 يناير 2026</p>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl mb-4">
                <p className="text-sm text-green-700 font-bold">النتيجة: سليم ✓</p>
              </div>
              <button className="w-full py-2 bg-green-100 text-green-600 rounded-xl font-bold hover:bg-green-200 transition-all">
                عرض التقرير
              </button>
            </div>
          </div>
        )}

        {activeTab === "medicines" && (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">💊</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">الأسبرين</h4>
                  <p className="text-sm text-gray-600">موصوف من الدكتور أحمد</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                الجرعة: 500 ملغ مرتين يومياً
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">من: 10/1 إلى: 31/1</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">نشط</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-md opacity-60">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">💉</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">فيتامين D</h4>
                  <p className="text-sm text-gray-600">موصوف من الدكتور علي</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                الجرعة: 1000 وحدة يومياً
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">من: 1/12 إلى: 31/12</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">انتهى</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "procedures" && (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">🏥</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">خلع ضرس العقل</h4>
                  <p className="text-sm text-gray-600">5 ديسمبر 2025</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl mb-4">
                <p className="text-sm text-gray-700 mb-2"><strong>التفاصيل:</strong></p>
                <p className="text-sm text-gray-600">
                  تم إجراء العملية في مستشفى الأمل تحت التخدير العام. سارت العملية بنجاح.
                </p>
              </div>
              <button className="w-full py-2 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-all">
                عرض التقرير الطبي
              </button>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">🩹</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">تنظيف الأسنان</h4>
                  <p className="text-sm text-gray-600">20 نوفمبر 2025</p>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl mb-4">
                <p className="text-sm text-green-700 font-bold">✓ تمت العملية بنجاح</p>
              </div>
              <button className="w-full py-2 bg-green-100 text-green-600 rounded-xl font-bold hover:bg-green-200 transition-all">
                عرض التفاصيل
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Bottom Navigation ===== */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="flex justify-around items-center px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600"
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs">الرئيسية</span>
          </button>
          <button
            onClick={() => router.push("/search")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-xs">البحث</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-600 font-semibold">
            <span className="text-2xl">📋</span>
            <span className="text-xs">السجل</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-xs">الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
