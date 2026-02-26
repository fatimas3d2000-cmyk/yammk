"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Payment() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [activeTab, setActiveTab] = useState("payment");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [providerLocation, setProviderLocation] = useState({ latitude: 33.3128, longitude: 44.3615, distance: 2.5, eta: 8 });
  const [messages, setMessages] = useState<any[]>([
    { id: 1, sender: "provider", text: "السلام عليكم، أنا الممرض محمد أحمد 👋", time: "14:35" },
    { id: 2, sender: "provider", text: "أنا هنا لمساعدتك، كيف حالك؟", time: "14:36" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // محاكاة تحديث موقع الممرض كل ثانية + Load preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Listen for storage changes
    window.addEventListener("storage", (e) => {
      if (e.key === "darkMode" && e.newValue) {
        setDarkMode(JSON.parse(e.newValue));
      }
      if (e.key === "language" && e.newValue) {
        setLanguage(e.newValue);
      }
    });
  }, []);

  // Tracking location update
  useEffect(() => {
    if (!trackingOpen) return;

    const interval = setInterval(() => {
      setProviderLocation(prev => {
        const newDistance = Math.max(0, prev.distance - 0.05);
        const newEta = Math.max(0, prev.eta - 0.3);
        return {
          ...prev,
          distance: parseFloat(newDistance.toFixed(2)),
          eta: parseFloat(newEta.toFixed(1))
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trackingOpen]);

  const subtotal = 150;
  const tax = 15;
  const discount = 10;
  const total = subtotal + tax - discount;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // محاكاة معالجة الدفع
    setTimeout(() => {
      if (paymentMethod === "cash") {
        // رسالة الدفع الكاش
        setPaymentStatus({
          success: true,
          message: `تم تأكيد الطلب بنجاح!`,
          details: `سيتم الدفع عند الاستقبال\nالمبلغ: ${total} د.ع\n\nسيتصل بك الممرض قريباً لتأكيد التفاصيل`,
          amount: total,
          timestamp: new Date().toLocaleTimeString("ar-SA")
        });
      } else {
        // رسالة التحويل البنكي
        const providerAccount = "IQ" + Math.random().toString().substring(2, 23);
        setPaymentStatus({
          success: true,
          message: `تم التحويل بنجاح!`,
          details: `تم تحويل ${total} د.ع من حسابك إلى حساب الممرض\n\nحساب الممرض: ${providerAccount}`,
          amount: total,
          providerAccount: providerAccount,
          timestamp: new Date().toLocaleTimeString("ar-SA")
        });
      }

      // فتح الدردشة تلقائياً بعد الدفع الناجح
      setTimeout(() => {
        setChatOpen(true);
      }, 1500);
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "patient",
        text: newMessage,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // رد من الممرض بعد ثانيتين
      setTimeout(() => {
        const responses = [
          "حسناً، سأساعدك بكل سرور 😊",
          "أنا مستعد لخدمتك في أي وقت 👍",
          "شكراً على ثقتك بي ❤️",
          "سأصل إليك في الموعد المحدد ✅"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const providerReply = {
          id: messages.length + 2,
          sender: "provider",
          text: randomResponse,
          time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, providerReply]);
      }, 2000);
    }
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-purple-50 via-pink-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" : "border-purple-100 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{t("paymentInvoices", language)}</h1>
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
          onClick={() => setActiveTab("payment")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            activeTab === "payment"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          {t("paymentTab", language)}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            activeTab === "history"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          السجل
        </button>
      </div>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-32">
        {activeTab === "payment" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-6 bg-white rounded-2xl shadow-md border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-5">ملخص الطلب</h3>
              
              <div className="space-y-3 pb-4 border-b-2 border-gray-100">
                <div className="flex justify-between text-gray-700">
                  <span>خدمة التمريض - 3 ساعات</span>
                  <span className="font-bold">150 د.ع</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>الضريبة (10%)</span>
                  <span>15 د.ع</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>خصم (كود SAVE10)</span>
                  <span>-10 د.ع</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4">
                <span className="text-xl font-bold text-gray-800">الإجمالي</span>
                <span className="text-3xl font-bold text-purple-600">155 د.ع</span>
              </div>
            </div>

            {/* Discount Code */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <label className="text-sm font-bold text-gray-700 mb-3 block">كود الخصم</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="أدخل الكود"
                  className="flex-1 px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all">
                  تطبيق
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-5">{t("paymentMethod", language)}</h3>

              {/* Card */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl mb-3 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                onClick={() => setPaymentMethod("card")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  readOnly
                  className="w-5 h-5 text-purple-600 cursor-pointer"
                />
                <span className="text-2xl mr-3">💳</span>
                <div>
                  <p className="font-bold text-gray-800">بطاقة ائتمان</p>
                  <p className="text-xs text-gray-600">فيزا أو ماستركارد</p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl mb-3 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                onClick={() => setPaymentMethod("bank")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  readOnly
                  className="w-5 h-5 text-purple-600 cursor-pointer"
                />
                <span className="text-2xl mr-3">🏦</span>
                <div>
                  <p className="font-bold text-gray-800">تحويل بنكي</p>
                  <p className="text-xs text-gray-600">من حسابك البنكي</p>
                </div>
              </label>

              {/* Apple Pay */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl mb-3 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                onClick={() => setPaymentMethod("apple")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "apple"}
                  readOnly
                  className="w-5 h-5 text-purple-600 cursor-pointer"
                />
                <span className="text-2xl mr-3">🍎</span>
                <div>
                  <p className="font-bold text-gray-800">Apple Pay</p>
                  <p className="text-xs text-gray-600">دفع آمن وسريع</p>
                </div>
              </label>

              {/* Cash Payment */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
                onClick={() => setPaymentMethod("cash")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  readOnly
                  className="w-5 h-5 text-purple-600 cursor-pointer"
                />
                <span className="text-2xl mr-3">💵</span>
                <div>
                  <p className="font-bold text-gray-800">دفع كاش</p>
                  <p className="text-xs text-gray-600">{t("paymentOnDelivery", language)}</p>
                </div>
              </label>
            </div>

            {/* Card Details (if card selected) */}
            {paymentMethod === "card" && (
              <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">رقم البطاقة</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">انتهاء الصلاحية</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash Payment Info */}
            {paymentMethod === "cash" && (
              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h4 className="text-lg font-bold text-orange-700 mb-2">{t("paymentOnDeliveryDesc", language)}</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>✓ {t("providerWillReceive", language)}</li>
                      <li>✓ {t("noAdditionalFees", language)}</li>
                      <li>✓ {t("receiptWillBeSent", language)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pay Button */}
            {paymentStatus ? (
              <div className="space-y-4">
                <div className={`p-6 rounded-2xl text-center ${paymentStatus.success ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'}`}>
                  <span className="text-5xl mb-3 block">{paymentStatus.success ? '✅' : '❌'}</span>
                  <h3 className={`text-2xl font-bold mb-2 ${paymentStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                    {paymentStatus.message}
                  </h3>
                  <p className={`text-sm whitespace-pre-line ${paymentStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                    {paymentStatus.details}
                  </p>
                  <p className={`text-xs mt-4 ${paymentStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                    الوقت: {paymentStatus.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPaymentStatus(null);
                    router.push("/my-orders");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all active:scale-95"
                >
                  عرض طلباتي
                </button>
              </div>
            ) : (
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t("processingPayment", language) : t("confirmPayment", language) + ' - 155 د.ع'}
              </button>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">✅</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">تمريض منزلي</h4>
                  <p className="text-sm text-gray-600">15 يناير 2026</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-600 font-bold">{t("paymentDone", language)}</span>
                <span className="text-2xl font-bold text-gray-800">150 د.ع</span>
              </div>
              <button className="w-full py-2 bg-purple-100 text-purple-600 rounded-xl font-bold hover:bg-purple-200 transition-all">
                عرض الفاتورة
              </button>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">✅</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">فحوصات معملية</h4>
                  <p className="text-sm text-gray-600">8 يناير 2026</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-600 font-bold">{t("paymentDone", language)}</span>
                <span className="text-2xl font-bold text-gray-800">120 د.ع</span>
              </div>
              <button className="w-full py-2 bg-purple-100 text-purple-600 rounded-xl font-bold hover:bg-purple-200 transition-all">
                عرض الفاتورة
              </button>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">✅</span>
                <div className="flex-1 text-right mr-4">
                  <h4 className="text-lg font-bold text-gray-800">استشارة طبية</h4>
                  <p className="text-sm text-gray-600">1 يناير 2026</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-600 font-bold">تم الدفع</span>
                <span className="text-2xl font-bold text-gray-800">200 د.ع</span>
              </div>
              <button className="w-full py-2 bg-purple-100 text-purple-600 rounded-xl font-bold hover:bg-purple-200 transition-all">
                عرض الفاتورة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Floating Chat Button (when chat is closed) ===== */}
      {!chatOpen && paymentStatus && (
        <div className="fixed bottom-28 left-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => setTrackingOpen(!trackingOpen)}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all active:scale-95"
            title="تتبع الممرض"
          >
            <span className="text-2xl">📍</span>
            <span className="text-xs font-bold">تتبع</span>
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all active:scale-95"
            title="فتح الدردشة"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs font-bold">دردشة</span>
          </button>
        </div>
      )}

      {/* ===== Chat & Tracking Modal Overlay ===== */}
      {(chatOpen || trackingOpen) && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"></div>
      )}

      {/* ===== Tracking Window ===== */}
      {trackingOpen && (
        <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-96 sm:h-screen bg-white shadow-2xl rounded-t-3xl sm:rounded-none flex flex-col">
          {/* Tracking Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-5 flex items-center justify-between rounded-t-3xl sm:rounded-none">
            <button
              onClick={() => setTrackingOpen(false)}
              className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold">📍 تتبع الممرض</h3>
              <p className="text-xs text-white/80">موقع فعلي مباشر</p>
            </div>
            <button 
              onClick={() => setChatOpen(true)}
              className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
            >
              <span className="text-xl">💬</span>
            </button>
          </div>

          {/* Map Area */}
          <div className="flex-1 bg-gradient-to-b from-blue-50 to-cyan-50 relative overflow-hidden">
            {/* Interactive Map */}
            <div className="w-full h-full relative">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50"></div>
              
              {/* Road/Path Elements */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                {/* Curved Path */}
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.4 }} />
                  </linearGradient>
                </defs>
                {/* Main Route */}
                <path 
                  d="M 20% 80% Q 50% 40%, 80% 20%" 
                  stroke="url(#pathGradient)" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeDasharray="10,5"
                />
                {/* Distance Markers */}
                <circle cx="35%" cy="65%" r="3" fill="#3b82f6" opacity="0.5" />
                <circle cx="50%" cy="50%" r="3" fill="#3b82f6" opacity="0.5" />
                <circle cx="65%" cy="35%" r="3" fill="#3b82f6" opacity="0.5" />
              </svg>

              {/* Destination Marker (Patient Location) */}
              <div className="absolute top-8 left-8 z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{ width: '60px', height: '60px' }}></div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-center mt-3 bg-white px-3 py-1 rounded-full text-purple-600 shadow-md">موقعك</p>
              </div>

              {/* Provider Marker - Moving Position */}
              <div 
                className="absolute z-20 transition-all duration-1000"
                style={{
                  left: `${20 + (providerLocation.distance * 3)}%`,
                  top: `${80 - (providerLocation.distance * 2)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping" style={{ width: '50px', height: '50px' }}></div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-xl">
                    <span className="text-2xl">🚑</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-center mt-2 bg-white px-2 py-1 rounded-full text-blue-600 shadow-md">محمد أحمد</p>
              </div>

              {/* Distance Display */}
              <div className="absolute bottom-8 right-8 bg-white rounded-2xl shadow-xl p-4 z-30">
                <p className="text-xs text-gray-600 mb-1">المسافة الحالية</p>
                <p className="text-2xl font-bold text-blue-600">{providerLocation.distance} كم</p>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-30">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-800">بث مباشر</span>
              </div>

              {/* Street Names (Decorative) */}
              <div className="absolute inset-0 pointer-events-none">
                <p className="absolute text-xs text-gray-400 font-semibold" style={{ top: '20%', left: '15%' }}>شارع الخليج</p>
                <p className="absolute text-xs text-gray-400 font-semibold" style={{ top: '60%', right: '15%' }}>شارع النيل</p>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="p-6 border-t border-gray-200 bg-white space-y-4">
            {/* Distance & ETA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-center">
                <p className="text-xs text-gray-600 mb-2">المسافة</p>
                <p className="text-3xl font-bold text-blue-600">{providerLocation.distance}</p>
                <p className="text-xs text-gray-500 mt-1">كم</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200 text-center">
                <p className="text-xs text-gray-600 mb-2">الوقت المتبقي</p>
                <p className="text-3xl font-bold text-cyan-600">{Math.ceil(providerLocation.eta)}</p>
                <p className="text-xs text-gray-500 mt-1">دقيقة</p>
              </div>
            </div>

            {/* Provider Info */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">👨‍⚕️</span>
                <div>
                  <p className="font-bold text-gray-800">محمد أحمد</p>
                  <p className="text-sm text-gray-600">ممرض متخصص</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-600 font-bold">
                <span>⭐⭐⭐⭐⭐</span>
                <span>(127 تقييم)</span>
              </div>
            </div>

            {/* Call Button */}
            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <span>📞</span>
              <span>اتصل الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* ===== Chat Window ===== */}
      {chatOpen && (
        <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-96 sm:h-screen bg-white shadow-2xl rounded-t-3xl sm:rounded-none flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-5 flex items-center justify-between rounded-t-3xl sm:rounded-none">
            <button
              onClick={() => setChatOpen(false)}
              className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold">محمد أحمد 🏥</h3>
              <p className="text-xs text-white/80">متصل الآن</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setChatOpen(false);
                  setTrackingOpen(true);
                }}
                className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
                title="عرض التتبع"
              >
                <span className="text-xl">📍</span>
              </button>
              <button className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all">
                <span className="text-xl">📞</span>
              </button>
              <button className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all">
                <span className="text-xl">📹</span>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "patient" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === "patient"
                      ? "bg-gray-200 text-gray-800 rounded-bl-none"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "patient" ? "text-gray-600" : "text-white/70"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 bg-white p-4 flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="اكتب رسالتك..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-right"
            />
            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 hover:shadow-lg transition-all active:scale-95"
            >
              <span className="text-xl">📤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
