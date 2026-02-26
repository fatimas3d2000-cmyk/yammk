"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { t } from "@/lib/translations";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function ServiceDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const [selectedTab, setSelectedTab] = useState("details");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "darkMode" && e.newValue) {
        setDarkMode(JSON.parse(e.newValue));
      }
      if (e.key === "language" && e.newValue) {
        setLanguage(e.newValue);
      }
    });
  }, []);

  const services: any = {
    1: {
      name: "ممرض منزلي",
      icon: "👩‍⚕️",
      color: "from-blue-400 to-blue-600",
      price: 50,
      priceLabel: "50 د.ع/ساعة",
      rating: 4.8,
      reviews: 324,
      description: "تقديم خدمات التمريض المتخصصة في منزلك",
      details: [
        { id: "general", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 35 },
        { id: "bandage", name: "تغيير الضمادات", price: 40 },
        { id: "injection", name: "إعطاء الحقن", price: 30 },
        { id: "postop", name: "الرعاية بعد العمليات", price: 60 },
      ],
      addOns: [
        { id: "medication", name: "تحضير الأدوية وإعطاؤها", price: 20 },
        { id: "wound", name: "تنظيف والعناية بالجروح", price: 30 },
        { id: "monitoring", name: "مراقبة دورية كل ساعة", price: 25 },
        { id: "nightcare", name: "رعاية ليلية (بعد الساعة 8 مساءً)", price: 40 },
      ],
      providers: [
        { 
          name: "أحمد محمد", 
          rating: 4.9, 
          reviews: 156,
          phone: "0501234567",
          gender: "ذكر",
          licenseNumber: "LN-2024-0156",
          licenseBody: "وزارة الصحة السعودية",
          experience: "5+ سنوات",
          bio: "ممرض متخصص في الرعاية المنزلية مع خبرة عملية واسعة في العناية بالمرضى والعمليات الصحية المختلفة",
          clinic: "عيادة الأمل الطبية",
          location: "حي القدس، الرياض",
          distance: 2.5,
          certifications: ["شهادة العناية الصحية", "شهادة الإسعافات الأولية", "شهادة التمريض العام"]
        },
        { 
          name: "فاطمة علي", 
          rating: 4.7, 
          reviews: 98,
          phone: "0502345678",
          gender: "أنثى",
          licenseNumber: "LN-2024-0098",
          licenseBody: "وزارة الصحة السعودية",
          experience: "3+ سنوات",
          bio: "ممرضة متميزة في العناية بالمرضى المسنين والعمليات الطبية المنزلية",
          clinic: "عيادة الشفاء",
          location: "حي الهدا، الرياض",
          distance: 5.8,
          certifications: ["شهادة التمريض العام", "شهادة رعاية المسنين"]
        },
        { 
          name: "علي خالد", 
          rating: 4.6, 
          reviews: 70,
          phone: "0503456789",
          gender: "ذكر",
          licenseNumber: "LN-2024-0070",
          licenseBody: "وزارة الصحة السعودية",
          experience: "2+ سنوات",
          bio: "ممرض مجتهد مع تدريب متخصص في يمك العافية المنزلية والعمليات الطبية",
          clinic: "عيادة النور الطبية",
          location: "حي الملقا، الرياض",
          distance: 3.2,
          certifications: ["شهادة التمريض العام", "شهادة الإسعافات الأولية"]
        },
      ],
    },
    2: {
      name: "فحوصات مختبرية",
      icon: "🧪",
      color: "from-purple-400 to-purple-600",
      price: 100,
      priceLabel: "100 د.ع",
      rating: 4.9,
      reviews: 502,
      description: "فحوصات طبية دقيقة باستخدام أحدث التقنيات",
      details: [
        { id: "blood", name: "فحص الدم الشامل", price: 100 },
        { id: "urine", name: "تحليل البول", price: 50 },
        { id: "glucose", name: "فحص السكر", price: 40 },
        { id: "cholesterol", name: "تحليل الكوليسترول", price: 60 },
        { id: "liver", name: "فحوصات وظائف الكبد", price: 75 },
      ],
      addOns: [
        { id: "home-sample", name: "سحب العينة من المنزل", price: 50 },
        { id: "urgent", name: "نتائج سريعة (خلال 4 ساعات)", price: 75 },
        { id: "consultation", name: "استشارة طبية على النتائج", price: 100 },
      ],
      providers: [
        { 
          name: "مختبر الأمل", 
          rating: 4.9, 
          reviews: 298,
          phone: "0112233445",
          gender: "مؤسسة",
          licenseNumber: "LAB-2024-0298",
          licenseBody: "وزارة الصحة السعودية",
          experience: "15+ سنوات",
          bio: "مختبر متخصص في الفحوصات الطبية الدقيقة مع أحدث الأجهزة والتقنيات المخبرية",
          clinic: "مختبر الأمل المتقدم",
          location: "حي الروضة، الرياض",
          distance: 1.8,
          certifications: ["شهادة ISO 15189", "شهادة الفحوصات الطبية", "شهادة الجودة الدولية"]
        },
        { 
          name: "مختبر الشفاء", 
          rating: 4.8, 
          reviews: 204,
          phone: "0115544332",
          gender: "مؤسسة",
          licenseNumber: "LAB-2024-0204",
          licenseBody: "وزارة الصحة السعودية",
          experience: "10+ سنوات",
          bio: "مختبر موثوق مع نتائج دقيقة وسرعة في التحليل وموثوقية عالية",
          clinic: "مختبر الشفاء",
          location: "حي النسيم، الرياض",
          distance: 4.3,
          certifications: ["شهادة الفحوصات الطبية", "شهادة الجودة"]
        },
      ],
    },
    3: {
      name: "علاج فيزيائي",
      icon: "🧘",
      color: "from-emerald-400 to-emerald-600",
      price: 75,
      priceLabel: "75 د.ع/جلسة",
      rating: 4.7,
      reviews: 245,
      description: "برامج علاج فيزيائي متخصصة مع محترفين معتمدين",
      details: [
        { id: "rehab", name: "إعادة التأهيل", price: 75 },
        { id: "pain", name: "علاج الآلام", price: 80 },
        { id: "exercises", name: "تمارين العلاج", price: 60 },
        { id: "massage", name: "المساج العلاجي", price: 85 },
        { id: "strength", name: "تمارين قوة العضلات", price: 70 },
      ],
      addOns: [
        { id: "home-session", name: "جلسة في المنزل", price: 40 },
        { id: "equipment", name: "استخدام أجهزة متخصصة", price: 60 },
        { id: "program", name: "برنامج علاجي مخصص", price: 100 },
        { id: "followup", name: "متابعة دورية أسبوعية", price: 50 },
      ],
      providers: [
        { 
          name: "سارة أحمد", 
          rating: 4.8, 
          reviews: 142,
          phone: "0506789012",
          gender: "أنثى",
          licenseNumber: "PT-2024-0142",
          licenseBody: "وزارة الصحة السعودية",
          experience: "7+ سنوات",
          bio: "معالجة فيزيائية متخصصة في إعادة التأهيل والعلاج الحركي مع نتائج متميزة",
          clinic: "مركز العافية للعلاج الفيزيائي",
          location: "حي السليمانية، الرياض",
          distance: 4.1,
          certifications: ["شهادة العلاج الفيزيائي", "شهادة إعادة التأهيل", "شهادة العلاج اليدوي"]
        },
        { 
          name: "محمود كامل", 
          rating: 4.6, 
          reviews: 103,
          phone: "0507890123",
          gender: "ذكر",
          licenseNumber: "PT-2024-0103",
          licenseBody: "وزارة الصحة السعودية",
          experience: "5+ سنوات",
          bio: "معالج فيزيائي محترف مع تخصص في علاج الإصابات الرياضية وإعادة التأهيل",
          clinic: "مركز النور للعلاج الحركي",
          location: "حي الملقا، الرياض",
          distance: 3.7,
          certifications: ["شهادة العلاج الفيزيائي", "شهادة الإصابات الرياضية"]
        },
      ],
    },
    4: {
      name: "إسعافات أولية",
      icon: "🚘",
      color: "from-rose-400 to-rose-600",
      price: 200,
      priceLabel: "200 د.ع",
      rating: 4.9,
      reviews: 189,
      description: "خدمة إسعافات أولية طارئة على مدار الساعة",
      details: [
        { id: "response", name: "استجابة سريعة", price: 200 },
        { id: "medical", name: "دعم طبي فوري", price: 250 },
        { id: "transport", name: "نقل آمن للمستشفى", price: 300 },
        { id: "advanced", name: "إسعافات أولية متقدمة", price: 280 },
        { id: "assessment", name: "تقييم الحالة الصحية", price: 150 },
      ],
      addOns: [
        { id: "oxygen", name: "توفير الأكسجين", price: 150 },
        { id: "transport", name: "نقل متخصص للمستشفى", price: 200 },
        { id: "doctor-call", name: "استشارة طبيب فوراً", price: 100 },
        { id: "followup-visit", name: "متابعة منزلية بعد الحادث", price: 150 },
      ],
      providers: [
        { 
          name: "فريق الطوارئ أ", 
          rating: 4.9, 
          reviews: 156,
          phone: "911",
          gender: "فريق",
          licenseNumber: "EMG-2024-0156",
          licenseBody: "وزارة الصحة السعودية",
          experience: "20+ سنوات",
          bio: "فريق متخصص في الإسعافات الأولية والطوارئ الطبية مع استجابة سريعة وفعالة 24/7",
          clinic: "مركز الطوارئ الرئيسي",
          location: "الرياض - متاح في جميع المناطق",
          distance: 1.2,
          certifications: ["شهادة الإسعافات الأولية المتقدمة", "شهادة الطوارئ الطبية", "شهادة الحياة الأساسية"]
        },
        { 
          name: "فريق الطوارئ ب", 
          rating: 4.9, 
          reviews: 33,
          phone: "912",
          gender: "فريق",
          licenseNumber: "EMG-2024-0033",
          licenseBody: "وزارة الصحة السعودية",
          experience: "15+ سنوات",
          bio: "فريق متدرب وجاهز للاستجابة لحالات الطوارئ الطبية بكفاءة عالية",
          clinic: "فرع الطوارئ الثانوي",
          location: "الرياض - متاح في جميع المناطق",
          distance: 2.1,
          certifications: ["شهادة الإسعافات الأولية", "شهادة الطوارئ"]
        },
      ],
    },
  };

  const service = services[parseInt(serviceId || "1")] || services[1];

  // ترتيب المقدمين حسب المسافة من الأقرب إلى الأبعد
  const sortedProviders = [...(service.providers || [])].sort((a: any, b: any) => {
    return (a.distance || 999) - (b.distance || 999);
  });

  // حساب السعر الإجمالي
  const calculateTotalPrice = () => {
    let total = 0;
    
    // إضافة سعر الخدمات المختارة
    if (service.details) {
      service.details.forEach((detail: any) => {
        if (selectedServices.includes(detail.id)) {
          total += detail.price;
        }
      });
    }
    
    // إضافة سعر الخدمات الإضافية
    if (service.addOns) {
      service.addOns.forEach((addon: any) => {
        if (selectedAddOns.includes(addon.id)) {
          total += addon.price;
        }
      });
    }
    
    // إذا لم تكن هناك خدمات مختارة، أرجع السعر الأساسي
    return total > 0 ? total : service.price;
  };

  const totalPrice = calculateTotalPrice();

  const handleAddOnToggle = (addonId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" : "border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">التفاصيل</h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Service Header ===== */}
      <div className={`bg-gradient-to-r ${service.color} px-6 py-8`}>
        <div className="flex items-center gap-5 mb-6">
          <div className="flex items-center justify-center rounded-2xl bg-white/25 p-4">
            {service.icon.startsWith('/') ? (
              <Image 
                src={service.icon} 
                alt={service.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
            ) : (
              <span className="text-5xl">{service.icon}</span>
            )}
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-1">{service.name}</h2>
            <p className="text-white/85 text-sm">{service.priceLabel}</p>
            {selectedAddOns.length > 0 && (
              <p className="text-white font-bold mt-1">الإجمالي: {totalPrice} د.ع</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center">
            {"⭐".repeat(Math.floor(service.rating))}
            <span className="mr-2 text-lg font-bold">{service.rating}</span>
          </div>
          <span className="text-white/80">({service.reviews} تقييم)</span>
        </div>
      </div>

      {/* ===== Description ===== */}
      <div className={`px-6 py-6 ${darkMode ? "bg-gray-800/50" : "bg-white/50"}`}>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg`}>{service.description}</p>
      </div>

      {/* ===== Tabs ===== */}
      <div className={`sticky top-20 z-40 flex border-b ${darkMode ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-white/80"} backdrop-blur px-6`}>
        <button
          onClick={() => setSelectedTab("details")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            selectedTab === "details"
              ? "border-blue-600 text-blue-600"
              : darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          التفاصيل
        </button>
        <button
          onClick={() => setSelectedTab("providers")}
          className={`flex-1 py-4 font-bold text-center border-b-2 transition-all ${
            selectedTab === "providers"
              ? "border-blue-600 text-blue-600"
              : darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          المقدمون
        </button>
      </div>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-32">
        {selectedTab === "details" && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>اختر الخدمات المطلوبة:</h3>
              <div className="space-y-3">
                {service.details.map((detail: any) => (
                  <label
                    key={detail.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 hover:border-blue-400 cursor-pointer transition-all ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(detail.id)}
                      onChange={() => handleServiceToggle(detail.id)}
                      className="w-5 h-5 cursor-pointer accent-blue-600"
                    />
                    <div className="flex-1">
                      <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{detail.name}</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600 whitespace-nowrap">+ {detail.price} د.ع</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            {service.addOns && service.addOns.length > 0 && (
              <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"}`}>
                <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>خدمات إضافية اختيارية</h3>
                <div className="space-y-3">
                  {service.addOns.map((addon: any) => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 hover:border-blue-400 cursor-pointer transition-all ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addon.id)}
                        onChange={() => handleAddOnToggle(addon.id)}
                        className="w-5 h-5 cursor-pointer accent-blue-600"
                      />
                      <div className="flex-1">
                        <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{addon.name}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600 whitespace-nowrap">+ {addon.price} د.ع</span>
                    </label>
                  ))}
                </div>

            {/* Price Summary */}
            <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-green-200"}`}>
              <div className={`space-y-3 pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                {selectedServices.length > 0 && (
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>الخدمات المختارة:</p>
                    <div className="space-y-1">
                      {selectedServices.map(svcId => {
                        const service_obj = service.details.find((d: any) => d.id === svcId);
                        return (
                          <div key={svcId} className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} flex justify-between`}>
                            <span>{service_obj?.name}</span>
                            <span className="font-bold">{service_obj?.price} د.ع</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedAddOns.length > 0 && (
                <div className={`py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>الخدمات الإضافية:</p>
                  <div className="space-y-1">
                    {selectedAddOns.map(addonId => {
                      const addon = service.addOns.find((a: any) => a.id === addonId);
                      return (
                        <div key={addonId} className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} flex justify-between`}>
                          <span>{addon?.name}</span>
                          <span className="font-bold">{addon?.price} د.ع</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                <span className="text-2xl font-bold text-green-600">{totalPrice} د.ع</span>
              </div>
            </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "providers" && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>المقدمون المتاحون (مرتبة من الأقرب إلى الأبعد):</h3>
            {sortedProviders.map((provider: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full p-5 rounded-2xl transition-all active:scale-95 ${
                  selectedProvider?.name === provider.name
                    ? darkMode ? "bg-blue-900/40 border-2 border-blue-500 shadow-lg" : "bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-500 shadow-lg"
                    : darkMode ? "bg-gray-800 border-2 border-gray-700 hover:border-blue-400 shadow-md" : "bg-white border-2 border-gray-200 hover:border-blue-400 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{provider.name}</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>📍 {provider.distance} كم من موقعك</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">⭐ {provider.rating}</span>
                </div>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>({provider.reviews} تقييم)</p>
                <div 
                  className={`w-full py-3 rounded-xl font-bold transition-all text-center cursor-pointer ${
                    selectedProvider?.name === provider.name
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg"
                  }`}
                >
                  {selectedProvider?.name === provider.name ? "✓ مختار" : "اختيار"}
                </div>
              </button>
            ))}

            {/* Selected Provider Info */}
            {selectedProvider && (
              <div className="mt-8 space-y-4">
                {/* Main Profile Card */}
                <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-blue-900/30 border-blue-900/50" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"}`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-4xl shadow-lg">
                      {selectedProvider.gender === "أنثى" ? "👩‍⚕️" : "👨‍⚕️"}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold text-center mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {selectedProvider.name}
                  </h3>
                  <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>{service.name}</p>
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <span className="text-xl">⭐ {selectedProvider.rating}</span>
                    <span className={darkMode ? "text-gray-400" : "text-gray-600"}>({selectedProvider.reviews} تقييم)</span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>المعلومات الشخصية</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>الاسم الكامل:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.name}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>النوع:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.gender}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>رقم الهاتف:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.phone}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>الموقع:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} text-right`}>{selectedProvider.location}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-blue-900/30 border-l-4 border-blue-500" : "bg-blue-50 border-l-4 border-blue-500"}`}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>📍 المسافة:</span>
                      <span className={`font-bold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{selectedProvider.distance} كم</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>البيانات المهنية</h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl ${darkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>رقم الترخيص:</p>
                      <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.licenseNumber}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${darkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>جهة الترخيص:</p>
                      <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.licenseBody}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${darkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>سنوات الخبرة:</p>
                      <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.experience}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${darkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>العيادة:</p>
                      <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedProvider.clinic}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>النبذة الشخصية</h4>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-700"} leading-relaxed`}>{selectedProvider.bio}</p>
                </div>

                {/* Certifications */}
                <div className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>الشهادات والرخص</h4>
                  <div className="space-y-2">
                    {selectedProvider.certifications.map((cert: string, idx: number) => (
                      <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                        <span className="text-2xl">📜</span>
                        <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => router.push(`/booking?service=${serviceId}&provider=${selectedProvider.name}`)}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95 mt-4"
                >
                  احجز مع {selectedProvider.name.split(" ")[0]}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== Action Button ===== */}
      <div className={`fixed bottom-0 left-0 right-0 border-t ${darkMode ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"} backdrop-blur-md p-6`}>
        {selectedProvider ? (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>السعر الإجمالي</p>
              <p className="text-2xl font-bold text-blue-600">{totalPrice} د.ع</p>
            </div>
            <button 
              onClick={() => {
                const servicesParam = selectedServices.length > 0 ? `&services=${encodeURIComponent(JSON.stringify(selectedServices))}` : '';
                router.push(`/booking?service=${serviceId}&provider=${selectedProvider.name}&price=${totalPrice}${servicesParam}`);
              }}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              احجز مع {selectedProvider.name}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>السعر الإجمالي</p>
              <p className="text-2xl font-bold text-blue-600">{totalPrice} د.ع</p>
            </div>
            <button 
              onClick={() => {
                alert('يرجى اختيار الممرض أو المقدم قبل الحجز');
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              {t("requestService", language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
