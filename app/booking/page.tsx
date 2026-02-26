"use client";

import { Cairo } from "next/font/google";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Notifications from "@/components/Notifications";
import {
  getCurrentLocation,
  saveAddress,
  getUserAddresses,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from "@/lib/gpsUtils";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Booking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const provider = searchParams.get("provider");
  const price = searchParams.get("price");
  const selectedServicesStr = searchParams.get("services");
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [communicationAccepted, setCommunicationAccepted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [providerAuth, setProviderAuth] = useState<any>(null);
  // GPS and Address States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [newAddressName, setNewAddressName] = useState("");
  const [newAddressDescription, setNewAddressDescription] = useState("");
  const [newAddressLocation, setNewAddressLocation] = useState<any>(null);
  const [addressError, setAddressError] = useState("");

  // Load preferences on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load saved addresses
    const savedAddresses = getUserAddresses();
    setAddresses(savedAddresses);
    
    // Set default address as selected
    const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    } else if (savedAddresses.length > 0) {
      setSelectedAddressId(savedAddresses[0].id);
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
  }, [router]);

  // تحويل الخدمات المختارة من JSON string
  const selectedServices = selectedServicesStr ? JSON.parse(decodeURIComponent(selectedServicesStr)) : [];

  /**
   * Get GPS location and update form
   */
  const handleGetGPSLocation = async () => {
    setIsLoadingLocation(true);
    setAddressError("");

    try {
      const location = await getCurrentLocation();
      if (location) {
        setNewAddressLocation(location);
        setNewAddressDescription(
          `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
        );
      } else {
        setAddressError("فشل الحصول على الموقع. تأكد من تفعيل GPS.");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setAddressError("خطأ في الحصول على الموقع. حاول مرة أخرى.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * Save new address
   */
  const handleSaveNewAddress = () => {
    if (!newAddressName.trim()) {
      setAddressError("الرجاء إدخال اسم العنوان");
      return;
    }

    if (!newAddressLocation) {
      setAddressError("الرجاء تحديد الموقع باستخدام GPS");
      return;
    }

    // Ensure we're on client side
    if (typeof window === "undefined") {
      setAddressError("خطأ: التطبيق غير متاح على هذا الجهاز");
      return;
    }

    const newAddress: Address = {
      id: `address_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newAddressName,
      description: newAddressDescription,
      latitude: newAddressLocation.latitude,
      longitude: newAddressLocation.longitude,
      timestamp: new Date().toISOString(),
      isDefault: addresses.length === 0, // First address is default
    };

    saveAddress(newAddress);
    const updatedAddresses = getUserAddresses();
    setAddresses(updatedAddresses);
    setSelectedAddressId(newAddress.id);

    // Reset form
    setShowAddressForm(false);
    setNewAddressName("");
    setNewAddressDescription("");
    setNewAddressLocation(null);
    setAddressError("");
  };

  const services: any = {
    1: { 
      name: "ممرض منزلي", 
      icon: "/ggg (1).jpg",
      details: [
        { id: "general", name: "تمريض عام" },
        { id: "pressure", name: "قياس الضغط والسكر" },
        { id: "bandage", name: "تغيير الضمادات" },
        { id: "injection", name: "إعطاء الحقن" },
        { id: "postop", name: "الرعاية بعد العمليات" },
      ]
    },
    2: { 
      name: "فحوصات مختبرية", 
      icon: "/ggg (1).jpg",
      details: [
        { id: "blood", name: "فحص الدم الشامل" },
        { id: "urine", name: "تحليل البول" },
        { id: "glucose", name: "فحص السكر" },
        { id: "cholesterol", name: "تحليل الكوليسترول" },
        { id: "liver", name: "فحوصات وظائف الكبد" },
      ]
    },
    3: { 
      name: "علاج فيزيائي", 
      icon: "/ggg (1).jpg",
      details: [
        { id: "rehab", name: "إعادة التأهيل" },
        { id: "pain", name: "علاج الآلام" },
        { id: "exercises", name: "تمارين العلاج" },
        { id: "massage", name: "المساج العلاجي" },
        { id: "strength", name: "تمارين قوة العضلات" },
      ]
    },
    4: { 
      name: "إسعافات أولية", 
      icon: "/ggg (1).jpg",
      details: [
        { id: "response", name: "استجابة سريعة" },
        { id: "medical", name: "دعم طبي فوري" },
        { id: "transport", name: "نقل آمن للمستشفى" },
        { id: "advanced", name: "إسعافات أولية متقدمة" },
        { id: "assessment", name: "تقييم الحالة الصحية" },
      ]
    },
  };

  const service = services[parseInt(serviceId || "1")] || services[1];
  const providerName = provider || "لم يتم اختيار مقدم";
  const totalPrice = price || "0";

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        language={language}
        providerAuth={providerAuth}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNotificationClick={() => setNotificationsOpen(!notificationsOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        language={language}
        providerAuth={providerAuth}
      />

      {/* Notifications */}
      <Notifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        darkMode={darkMode}
        language={language}
      />

      {/* Main Content */}
      <div className="mt-[70px] pb-40">
        {/* ===== Content ===== */}
        <div className="px-6 py-6">
          {/* Service Summary */}
          <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>{t("bookingSummary", language)}</h3>
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{t("service", language)}:</span>
              <div className="flex items-center gap-2">
                {service.icon.startsWith('/') ? (
                  <Image 
                    src={service.icon} 
                    alt={service.name}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-2xl">{service.icon}</span>
                )}
                <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{service.name}</span>
              </div>
            </div>
            
            {/* Selected Services */}
            {selectedServices.length > 0 && (
              <div className={`pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>{t("selectedServices", language)}:</p>
                <div className="space-y-2">
                  {selectedServices.map((svcId: string) => {
                    const detail = service.details?.find((d: any) => d.id === svcId);
                    return (
                      <div key={svcId} className="flex items-center gap-2 text-sm">
                        <span className="text-blue-500">✓</span>
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{detail?.name || svcId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className={`flex items-center justify-between pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{t("serviceProvider", language)}:</span>
              <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{providerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{t("totalPrice", language)}:</span>
              <span className="text-2xl font-bold text-blue-600">{totalPrice} د.ع</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <label className={`text-lg font-bold block mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{t("requiredDate", language)}</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-teal-500" : "border-blue-300 text-gray-800 focus:ring-blue-500"}`}
          />
          {selectedDate && (
            <p className={`text-sm ${darkMode ? "text-teal-400" : "text-blue-600"} mt-3`}>
              {t("selectedDate", language)} {new Date(selectedDate).toLocaleDateString("ar-SA")}
            </p>
          )}
        </div>

        {/* Time Selection */}
        <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <label className={`text-lg font-bold block mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{t("preferredTime", language)}</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-teal-500" : "border-blue-300 text-gray-800 focus:ring-blue-500"}`}
          />
          {selectedTime && (
            <p className={`text-sm ${darkMode ? "text-teal-400" : "text-blue-600"} mt-3`}>
              {t("selectedTime", language)} {selectedTime}
            </p>
          )}
        </div>

        {/* Address */}
        <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <label className={`text-lg font-bold block mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{t("location", language)}</label>
          <div className="space-y-3">
            {/* Display saved addresses */}
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`w-full p-4 text-right border-2 rounded-xl transition-all ${
                  selectedAddressId === address.id
                    ? darkMode
                      ? "border-teal-500 bg-gray-700"
                      : "border-blue-500 bg-blue-50"
                    : darkMode
                    ? "border-gray-700 hover:border-teal-600 hover:bg-gray-700"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-right flex-1">
                    <span className="text-xl mr-2">📍</span>
                    <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        darkMode
                          ? "bg-teal-600 text-teal-100"
                          : "bg-blue-200 text-blue-700"
                      }`}>
                        افتراضي
                      </span>
                    )}
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
                      {address.description}
                    </p>
                  </div>
                  {selectedAddressId === address.id && (
                    <span className="text-2xl ml-2">✓</span>
                  )}
                </div>
              </button>
            ))}

            {/* Add New Address Button */}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className={`w-full p-4 text-center border-2 border-dashed rounded-xl font-bold transition-all ${
                  darkMode
                    ? "border-teal-600 text-teal-400 hover:bg-gray-700"
                    : "border-blue-400 text-blue-600 hover:bg-blue-50"
                }`}
              >
                + {t("addNewAddress", language)}
              </button>
            )}

            {/* Add Address Form */}
            {showAddressForm && (
              <div className={`p-5 border-2 rounded-xl ${darkMode ? "border-teal-600 bg-gray-700" : "border-blue-200 bg-blue-50"}`}>
                <h4 className={`font-bold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  🆕 إضافة عنوان جديد
                </h4>

                {/* Address Name Input */}
                <input
                  type="text"
                  value={newAddressName}
                  onChange={(e) => setNewAddressName(e.target.value)}
                  placeholder="اسم العنوان (مثل: البيت، المكتب)"
                  className={`w-full px-4 py-3 border-2 rounded-xl mb-3 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-teal-500"
                      : "border-gray-300 text-gray-800 focus:ring-blue-500"
                  }`}
                />

                {/* GPS Location Button */}
                <button
                  onClick={handleGetGPSLocation}
                  disabled={isLoadingLocation}
                  className={`w-full p-3 border-2 border-dashed rounded-xl font-bold mb-3 transition-all ${
                    isLoadingLocation
                      ? darkMode
                        ? "border-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
                        : "border-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
                      : darkMode
                      ? "border-teal-500 text-teal-400 hover:bg-gray-600"
                      : "border-blue-400 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {isLoadingLocation ? "⏳ جاري تحديد الموقع..." : "📍 تحديد الموقع من GPS"}
                </button>

                {/* Location Display */}
                {newAddressLocation && (
                  <div className={`p-3 rounded-xl mb-3 ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <p className={`text-sm font-bold ${darkMode ? "text-teal-400" : "text-blue-600"} mb-2`}>
                      ✓ تم تحديد الموقع
                    </p>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      الإحداثيات: {newAddressLocation.latitude.toFixed(6)}, {newAddressLocation.longitude.toFixed(6)}
                    </p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
                      الدقة: ±{Math.round(newAddressLocation.accuracy)} متر
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${newAddressLocation.latitude},${newAddressLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${darkMode ? "text-teal-400 hover:text-teal-300" : "text-blue-600 hover:text-blue-800"} mt-2 inline-block underline`}
                    >
                      عرض على Google Maps →
                    </a>
                  </div>
                )}

                {/* Description Display */}
                {newAddressDescription && (
                  <textarea
                    value={newAddressDescription}
                    onChange={(e) => setNewAddressDescription(e.target.value)}
                    placeholder="تفاصيل العنوان"
                    className={`w-full px-4 py-3 border-2 rounded-xl mb-3 focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-teal-500"
                        : "border-gray-300 text-gray-800 focus:ring-blue-500"
                    }`}
                    rows={2}
                  />
                )}

                {/* Error Message */}
                {addressError && (
                  <p className="text-red-500 text-sm mb-3 font-semibold">⚠️ {addressError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNewAddress}
                    disabled={!newAddressName.trim() || !newAddressLocation}
                    className={`flex-1 p-3 rounded-xl font-bold transition-all ${
                      newAddressName.trim() && newAddressLocation
                        ? darkMode
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        : darkMode
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    ✓ حفظ العنوان
                  </button>
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setNewAddressName("");
                      setNewAddressDescription("");
                      setNewAddressLocation(null);
                      setAddressError("");
                    }}
                    className={`flex-1 p-3 rounded-xl font-bold border-2 transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <label className={`text-lg font-bold block mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{t("additionalNotes", language)}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("additionalNotesPlaceholder", language)}
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-teal-500" : "border-gray-300 text-gray-800 focus:ring-blue-500"}`}
          />
        </div>

        {/* Confirmation Checklist */}
        <div className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>{t("confirmations", language)}</h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 hover:border-opacity-80 cursor-pointer ${darkMode ? "bg-blue-900/20 border-blue-700/50 hover:border-blue-600" : "bg-blue-50 border-blue-200 hover:border-blue-400"}`}>
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5" 
              />
              <span className={`font-semibold ${darkMode ? "text-blue-200" : "text-gray-700"}`}>{t("agreeTerms", language)}</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 hover:border-opacity-80 cursor-pointer ${darkMode ? "bg-rose-900/20 border-rose-700/50 hover:border-rose-600" : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 hover:border-rose-400"}`}>
              <input 
              
              type="checkbox" 
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-5 h-5" 
              />
              <div className="flex-1">
                <span className={`font-semibold ${darkMode ? "text-rose-200" : "text-gray-800"}`}>{t("agreePrivacy", language)}</span>
                <p className={`text-xs ${darkMode ? "text-rose-300/70" : "text-gray-600"} mt-1`}>{t("privacyDescription", language)}</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 hover:border-opacity-80 cursor-pointer ${darkMode ? "bg-green-900/20 border-green-700/50 hover:border-green-600" : "bg-green-50 border-green-200 hover:border-green-400"}`}>
              <input 
                type="checkbox" 
                checked={communicationAccepted}
                onChange={(e) => setCommunicationAccepted(e.target.checked)}
                className="w-5 h-5" 
              />
              <span className={`font-semibold ${darkMode ? "text-green-200" : "text-gray-700"}`}>{t("agreeCommunication", language)}</span>
            </label>
          </div>
        </div>

      {/* ===== Action Buttons ===== */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-6 space-y-3 backdrop-blur-md ${darkMode ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
        <button
          onClick={() => {
            if (!privacyAccepted) {
              alert(t("acceptPrivacy", language));
              return;
            }
            if (!termsAccepted) {
              alert(t("acceptTerms", language));
              return;
            }
            router.push("/payment?service=" + serviceId);
          }}
          disabled={!privacyAccepted || !termsAccepted}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
            privacyAccepted && termsAccepted
              ? "bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white hover:shadow-2xl"
              : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
          }`}
        >
          {privacyAccepted && termsAccepted ? t("continuePayment", language) : t("acceptConditions", language)}
        </button>
        <button
          onClick={() => router.back()}
          className={`w-full py-3 border-2 rounded-2xl font-bold transition-all ${darkMode ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
        >
          {t("back", language)}
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}
