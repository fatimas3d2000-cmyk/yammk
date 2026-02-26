"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function MyOrders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("current");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [userType, setUserType] = useState<"patient" | "provider" | null>(null);

  useEffect(() => {
    const patientAuthData = localStorage.getItem("patientAuth");
    if (patientAuthData) setUserType("patient");

    const providerAuthData = localStorage.getItem("providerAuth");
    if (providerAuthData) setUserType("provider");

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleCall = (phoneNumber: string, providerName: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Patient Orders Data
  const patientCurrentOrders = [
    {
      id: 1,
      icon: "💙",
      service: "تمريض منزلي",
      providerName: "أحمد محمد",
      providerPhone: "0501111111",
      providerEmail: "ahmed@example.com",
      providerRating: 4.9,
      address: "حي القدس، الرياض",
      date: "29 يناير 2026",
      time: "14:30",
      bookingTime: "29 يناير 2026 - 10:15 صباحاً",
      duration: "2 ساعة",
      totalPrice: 70,
      status: "مقبول",
      statusColor: "bg-green-500",
      selectedServices: [
        { id: "nursing", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 20 }
      ],
      addOns: [
        { id: "monitoring", name: "مراقبة دورية", price: 0 }
      ],
      notes: "يفضل استخدام الأجهزة الطبية الحديثة",
      paymentMethod: "بطاقة ائتمان",
      paymentStatus: "مدفوع"
    }
  ];

  const patientPastOrders = [
    {
      id: 1,
      icon: "💙",
      service: "تمريض منزلي",
      providerName: "أحمد محمد",
      providerPhone: "0501111111",
      providerEmail: "ahmed@example.com",
      providerRating: 4.9,
      date: "22 يناير 2026",
      time: "14:30",
      bookingTime: "22 يناير 2026 - 09:00 صباحاً",
      duration: "2 ساعة",
      totalPrice: 70,
      rating: 4.8,
      review: "خدمة رائعة وسريعة",
      selectedServices: [
        { id: "nursing", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 20 }
      ],
      addOns: [
        { id: "monitoring", name: "مراقبة دورية", price: 0 }
      ],
      notes: "تم الانتهاء بنجاح",
      paymentMethod: "محفظة رقمية",
      paymentStatus: "مدفوع"
    }
  ];

  // Provider Orders Data
  const providerCurrentOrders = [
    {
      id: 1,
      icon: "👤",
      patientName: "محمد علي",
      patientPhone: "0502222222",
      patientEmail: "patient@example.com",
      patientAge: 45,
      service: "تمريض منزلي",
      address: "حي الزيتون، بغداد",
      date: "29 يناير 2026",
      time: "14:30",
      bookingTime: "29 يناير 2026 - 10:15 صباحاً",
      duration: "2 ساعة",
      totalPrice: 70,
      status: "معلق",
      statusColor: "bg-yellow-500",
      selectedServices: [
        { id: "nursing", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 20 }
      ],
      notes: "المريض يحتاج مراقبة خاصة",
      paymentStatus: "مدفوع",
      revenue: 70
    }
  ];

  const providerCompletedOrders = [
    {
      id: 1,
      icon: "👤",
      patientName: "محمد علي",
      patientPhone: "0502222222",
      patientEmail: "patient@example.com",
      patientAge: 45,
      service: "تمريض منزلي",
      address: "حي الزيتون، بغداد",
      date: "22 يناير 2026",
      time: "14:30",
      bookingTime: "22 يناير 2026 - 09:00 صباحاً",
      duration: "2 ساعة",
      totalPrice: 70,
      status: "مكتمل",
      statusColor: "bg-green-500",
      selectedServices: [
        { id: "nursing", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 20 }
      ],
      notes: "تم الانتهاء بنجاح",
      paymentStatus: "مدفوع",
      revenue: 70,
      patientRating: 4.9
    }
  ];

  // Determine which orders to show based on user type
  const currentOrders = userType === "provider" ? providerCurrentOrders : patientCurrentOrders;
  const pastOrders = userType === "provider" ? providerCompletedOrders : patientPastOrders;

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} ${cairo.className}`}>
      {/* ===== Header ===== */}
      <header className={`fixed top-0 left-0 right-0 z-40 border-b-2 ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" : "border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {userType === "provider" ? "الحجوزات المدرجة" : "طلباتي"}
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      <div className="pt-24 pb-32 px-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("current")}
            className={`py-2 px-6 rounded-xl font-bold transition-all ${
              activeTab === "current" ? "bg-blue-500 text-white" : darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}
          >
            {userType === "provider" ? "الحجوزات الحالية" : "الطلبات الحالية"}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-6 rounded-xl font-bold transition-all ${
              activeTab === "past" ? "bg-blue-500 text-white" : darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}
          >
            {userType === "provider" ? "الحجوزات المكتملة" : "الطلبات السابقة"}
          </button>
        </div>

        {activeTab === "current" && (
          <div className="space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <div key={order.id} className={`p-5 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{order.icon}</span>
                      <div className="text-right">
                        <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{order.service}</h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {userType === "provider" ? order.patientName : order.providerName}
                        </p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          {userType === "provider" ? `📞 ${order.patientPhone}` : `⭐ ${order.providerRating}`}
                        </p>
                      </div>
                    </div>
                    <span className={`${order.statusColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>{order.status}</span>
                  </div>
                  <div className={`flex items-center justify-between text-sm mb-4 pb-4 border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
                    <span>⏰ {order.time}</span>
                    <span>📅 {order.date}</span>
                  </div>
                  <div className="flex gap-3">
                    {userType === "provider" ? (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                        >
                          التفاصيل
                        </button>
                        <button className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-green-900/30 text-green-300 hover:bg-green-900/50" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                          ✅ قبول
                        </button>
                        <button className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
                          ❌ رفض
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                        >
                          التفاصيل
                        </button>
                        <button onClick={() => handleCall(order.providerPhone, order.providerName)} className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-green-900/30 text-green-300 hover:bg-green-900/50" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                          ☎️ اتصل
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <span className="text-6xl mb-4 block">📋</span>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{userType === "provider" ? "لا توجد حجوزات حالية" : "لا توجد طلبات حالية"}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-4">
            {pastOrders.length > 0 ? (
              pastOrders.map((order) => (
                <div key={order.id} className={`p-5 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{order.icon}</span>
                      <div className="text-right">
                        <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{order.service}</h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {userType === "provider" ? order.patientName : order.providerName}
                        </p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          {userType === "provider" ? `📞 ${order.patientPhone}` : `⭐ ${order.providerRating}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{order.totalPrice} د.ع</p>
                      <p className="text-yellow-500 text-sm">
                        {userType === "provider" ? `💰 الدخل: ${order.revenue}` : `⭐ ${order.rating}`}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between text-sm mb-4 pb-4 border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
                    <span>⏰ {order.time}</span>
                    <span>📅 {order.date}</span>
                  </div>
                  {userType !== "provider" && order.review && (
                    <div className={`p-3 rounded-xl mb-4 ${darkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-700"} font-semibold`}>التقييم: {order.review}</p>
                    </div>
                  )}
                  {userType === "provider" && order.patientRating && (
                    <div className={`p-3 rounded-xl mb-4 ${darkMode ? "bg-purple-900/20" : "bg-purple-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-purple-300" : "text-purple-700"} font-semibold`}>تقييم المريض: ⭐ {order.patientRating}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                    >
                      التفاصيل
                    </button>
                    {userType === "provider" ? (
                      <>
                        <button onClick={() => handleCall(order.patientPhone, order.patientName)} className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50" : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`}>
                          ☎️ تواصل
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => router.push("/booking")} className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}>
                          حجز مرة أخرى
                        </button>
                        <button onClick={() => handleCall(order.providerPhone, order.providerName)} className={`flex-1 py-2 rounded-xl font-bold transition-all ${darkMode ? "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50" : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`}>
                          ☎️ اتصل
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <span className="text-6xl mb-4 block">📋</span>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {userType === "provider" ? "لا توجد حجوزات مكتملة" : "لا توجد طلبات سابقة"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== Order Details Modal ===== */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-3xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto`}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <button 
                onClick={() => {
                  setShowDetails(false);
                  setSelectedOrder(null);
                }}
                className="text-3xl hover:scale-110 transition"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
              <span className="text-3xl">{selectedOrder.icon}</span>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className={`p-4 rounded-2xl border-2 ${darkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-300"}`}>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>{selectedOrder.service}</h3>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedOrder.totalPrice} د.ع</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${selectedOrder.statusColor}`}>{selectedOrder.status}</span>
                </div>
              </div>

              {/* Provider Information */}
              {/* Provider or Patient Information */}
              <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-lg font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {userType === "provider" ? "👤 معلومات المريض" : "👤 معلومات مزود الخدمة"}
                </h4>
                <div className="space-y-2 text-sm">
                  {userType === "provider" ? (
                    <>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">الاسم:</span> {selectedOrder.patientName}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">العمر:</span> {selectedOrder.patientAge}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">الهاتف:</span> {selectedOrder.patientPhone}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">البريد الإلكتروني:</span> {selectedOrder.patientEmail}</p>
                    </>
                  ) : (
                    <>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">الاسم:</span> {selectedOrder.providerName}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">التقييم:</span> ⭐ {selectedOrder.providerRating}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">الهاتف:</span> {selectedOrder.providerPhone}</p>
                      <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">البريد الإلكتروني:</span> {selectedOrder.providerEmail}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-lg font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>📅 تفاصيل الموعد</h4>
                <div className="space-y-2 text-sm">
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">التاريخ:</span> {selectedOrder.date}</p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">الوقت:</span> {selectedOrder.time}</p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">وقت الحجز:</span> {selectedOrder.bookingTime}</p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">مدة الخدمة:</span> {selectedOrder.duration}</p>
                </div>
              </div>

              {/* Services Selected */}
              <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-lg font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>🏥 الخدمات المختارة</h4>
                <div className="space-y-2">
                  {selectedOrder.selectedServices.map((service: any) => (
                    <div key={service.id} className={`flex justify-between items-center p-2 rounded-lg ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{service.name}</span>
                      <span className={`font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>{service.price} د.ع</span>
                    </div>
                  ))}
                  {selectedOrder.addOns && selectedOrder.addOns.length > 0 && (
                    <>
                      <div className={`text-sm font-semibold mt-3 mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>الخيارات الإضافية:</div>
                      {selectedOrder.addOns.map((addon: any) => (
                        <div key={addon.id} className={`flex justify-between items-center p-2 rounded-lg ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                          <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{addon.name}</span>
                          <span className={`font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{addon.price > 0 ? addon.price + " د.ع" : "مجاني"}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className={`text-lg font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>💳 معلومات الدفع</h4>
                <div className="space-y-2 text-sm">
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">طريقة الدفع:</span> {selectedOrder.paymentMethod}</p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}><span className="font-semibold">حالة الدفع:</span> <span className="text-green-500 font-bold">{selectedOrder.paymentStatus}</span></p>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className={`p-4 rounded-2xl ${darkMode ? "bg-yellow-900/20 border-2 border-yellow-700/50" : "bg-yellow-50 border-2 border-yellow-300"}`}>
                  <h4 className={`text-lg font-bold mb-2 ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>📝 ملاحظات</h4>
                  <p className={darkMode ? "text-yellow-200" : "text-yellow-800"}>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Rating Section for Past Orders */}
              {selectedOrder.rating && (
                <div className={`p-4 rounded-2xl ${darkMode ? "bg-purple-900/20 border-2 border-purple-700/50" : "bg-purple-50 border-2 border-purple-300"}`}>
                  <h4 className={`text-lg font-bold mb-2 ${darkMode ? "text-purple-300" : "text-purple-700"}`}>⭐ تقييمك</h4>
                  <p className={`text-lg font-bold mb-2 ${darkMode ? "text-purple-200" : "text-purple-800"}`}>{selectedOrder.rating} / 5</p>
                  <p className={darkMode ? "text-purple-200" : "text-purple-800"}>{selectedOrder.review}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => userType === "provider" 
                    ? handleCall(selectedOrder.patientPhone, selectedOrder.patientName)
                    : handleCall(selectedOrder.providerPhone, selectedOrder.providerName)
                  }
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${darkMode ? "bg-green-900/30 text-green-300 hover:bg-green-900/50" : "bg-green-100 text-green-600 hover:bg-green-200"}`}
                >
                  ☎️ {userType === "provider" ? "اتصل بالمريض" : "اتصل بمزود الخدمة"}
                </button>
                <button 
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedOrder(null);
                  }}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-0 left-0 right-0 border-t ${darkMode ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"} backdrop-blur-md`}>
        <div className="flex justify-around items-center px-6 py-4">
          <button onClick={() => router.push("/")} className={`flex flex-col items-center gap-1 ${darkMode ? "text-gray-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"}`}>
            <span className="text-2xl">🏠</span>
            <span className="text-xs">الرئيسية</span>
          </button>
          {userType === "patient" && (
            <button onClick={() => router.push("/search")} className={`flex flex-col items-center gap-1 ${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
              <span className="text-2xl">🔍</span>
              <span className="text-xs">البحث</span>
            </button>
          )}
          <button className={`flex flex-col items-center gap-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            <span className="text-2xl">📋</span>
            <span className="text-xs">{userType === "patient" ? "طلباتي" : "الحجوزات"}</span>
          </button>
          <button onClick={() => router.push("/settings")} className={`flex flex-col items-center gap-1 ${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
            <span className="text-2xl">⚙️</span>
            <span className="text-xs">الإعدادات</span>
          </button>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
