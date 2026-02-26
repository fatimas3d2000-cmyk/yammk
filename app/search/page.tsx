"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import PatientBottomNav from "@/components/PatientBottomNav";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function SearchAndFilter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const [rating, setRating] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [providerAuth, setProviderAuth] = useState<any>(null);

  // Iraqi regions
  const iraqiRegions = [
    "بغداد",
    "الأنبار",
    "بابل",
    "البصرة",
    "ديالى",
    "الديوانية",
    "دهوك",
    "كربلاء",
    "كركوك",
    "النجف",
    "نينوى",
    "صلاح الدين",
    "السليمانية",
    "واسط",
    "ميسان",
    "ذي قار",
    "أربيل"
  ];

  // Neighborhoods for each region
  const neighborhoodsByRegion: any = {
    "بغداد": ["الكرادة", "الاعظمية", "الدورة", "الزيتون", "الوزيرية", "الخضرة", "الشرقية", "الكاظمية", "المنصور", "ديالى", "الرصافة", "الكهرمانة"],
    "الأنبار": ["الرمادي", "الفلوجة", "الفاللجة", "الخالدية", "الرمادي الجديدة", "القائم"],
    "بابل": ["الحلة", "الكيفية", "النجيبية", "المسيب", "العرقة", "دوامة"],
    "البصرة": ["البصرة", "أم قصر", "الأسكندرية", "الشعيبة", "الزبير", "الفاو"],
    "ديالى": ["بعقوبة", "خانقين", "المقدادية", "الخالص", "جسر ديالى"],
    "الديوانية": ["الديوانية", "الصماوة", "الافلاج", "عفك", "بني حسن"],
    "دهوك": ["دهوك", "زاخو", "عمادية", "شيخان", "بارزان"],
    "كربلاء": ["كربلاء", "الحسينية", "الهندية", "جناح", "عين التمر"],
    "كركوك": ["كركوك", "داقوق", "الحويجة", "القره تبة", "شوشة"],
    "النجف": ["النجف", "الكوفة", "المشخاب", "الحيرة", "الصفيرة"],
    "نينوى": ["الموصل", "تلكيف", "تلعفر", "الموصل الجديدة", "القوش"],
    "صلاح الدين": ["تكريت", "الدور", "سامراء", "التاجي", "بلد"],
    "السليمانية": ["السليمانية", "الرانية", "حلبجة", "دربندخان", "خانقين"],
    "واسط": ["الكوت", "الصويلح", "الحي", "العزيزية", "بديع"],
    "ميسان": ["العمارة", "القرنة", "الميمونة", "الفجر", "علي الغربي"],
    "ذي قار": ["الناصرية", "الحي", "سوق الشيوخ", "الرفاعي", "الدروة", "الفهود", "الزبيدية", "البطحاء", "الوحدة", "القرنة"],
    "أربيل": ["أربيل", "عقرة", "كويسنجق", "شقلاوة", "روانة"]
  };

  // Sub-areas within each neighborhood
  const subAreasByNeighborhood: any = {
    "الناصرية": ["الناصرية الجديدة", "الناصرية القديمة", "الطلحة", "الباشا", "الشارع العام"],
    "الحي": ["الحي الشرقي", "الحي الغربي", "الحي الشمالي", "الحي الجنوبي"],
    "سوق الشيوخ": ["السوق الرئيسي", "الشارع الجديد", "حي التوسع"],
    "الرفاعي": ["الرفاعي الجديدة", "الرفاعي القديمة"],
    "الدروة": ["الدروة الغربية", "الدروة الشرقية"],
    "الفهود": ["الفهود الشمالية", "الفهود الجنوبية"],
    "الزبيدية": ["منطقة الزبيدية الرئيسية"],
    "البطحاء": ["البطحاء الجنوبية"],
    "الوحدة": ["منطقة الوحدة"],
    "القرنة": ["القرنة الشرقية", "القرنة الغربية"],
    "الكرادة": ["الكرادة الشرقية", "الكرادة الغربية"],
    "الاعظمية": ["الاعظمية الجديدة", "الاعظمية القديمة"],
    "البصرة": ["البصرة الجديدة", "البصرة القديمة"],
    "الموصل": ["الموصل الغربية", "الموصل الشرقية", "الموصل الجديدة"]
  };

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (auth) {
      try {
        setProviderAuth(JSON.parse(auth));
      } catch (e) {
        console.error("Error parsing provider auth:", e);
      }
    }

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

  const services = [
    { id: 1, name: "ممرض منزلي", icon: "💙", price: 50, rating: 4.8, category: "nursing", region: "بغداد", neighborhood: "الكرادة", subArea: "الكرادة الشرقية", provider: "أحمد محمد" },
    { id: 2, name: "فحوصات مختبرية", icon: "🧪", price: 100, rating: 4.9, category: "lab", region: "بغداد", neighborhood: "الاعظمية", subArea: "الاعظمية الجديدة", provider: "فاطمة علي" },
    { id: 3, name: "علاج فيزيائي", icon: "🧘", price: 75, rating: 4.7, category: "therapy", region: "البصرة", neighborhood: "البصرة", subArea: "البصرة الجديدة", provider: "محمود حسن" },
    { id: 4, name: "إسعافات أولية", icon: "🚑", price: 200, rating: 4.9, category: "emergency", region: "بغداد", neighborhood: "الدورة", subArea: "الدورة", provider: "سارة خليل" },
    { id: 5, name: "استشارة طبية", icon: "🩺", price: 60, rating: 4.8, category: "nursing", region: "الموصل", neighborhood: "الموصل", subArea: "الموصل الغربية", provider: "علي رياض" },
    { id: 6, name: "تحاليل الدم", icon: "🧬", price: 120, rating: 4.9, category: "lab", region: "الحلة", neighborhood: "الحلة", subArea: "الحلة", provider: "مريم أحمد" },
    { id: 7, name: "مساج علاجي", icon: "💆", price: 80, rating: 4.6, category: "therapy", region: "النجف", neighborhood: "النجف", subArea: "النجف", provider: "خالد إبراهيم" },
    { id: 8, name: "حقن ومراقبة", icon: "💉", price: 40, rating: 4.8, category: "nursing", region: "كربلاء", neighborhood: "كربلاء", subArea: "كربلاء", provider: "نور قاسم" },
    // خدمات ذي قار - جميع الأحياء
    { id: 9, name: "ممرضة مختصة", icon: "💙", price: 55, rating: 4.9, category: "nursing", region: "ذي قار", neighborhood: "الناصرية", subArea: "الناصرية الجديدة", provider: "سارة عبدالله" },
    { id: 10, name: "فحص طبي شامل", icon: "🩺", price: 150, rating: 4.8, category: "nursing", region: "ذي قار", neighborhood: "الناصرية", subArea: "الطلحة", provider: "د. محمود أحمد" },
    { id: 11, name: "علاج فيزيائي متقدم", icon: "🧘", price: 90, rating: 4.7, category: "therapy", region: "ذي قار", neighborhood: "الناصرية", subArea: "الباشا", provider: "فهد الشيوخ" },
    { id: 12, name: "تحاليل متخصصة", icon: "🧪", price: 130, rating: 4.9, category: "lab", region: "ذي قار", neighborhood: "الناصرية", subArea: "الشارع العام", provider: "عائشة علي" },
    { id: 13, name: "جلسات تأهيل", icon: "🏥", price: 70, rating: 4.6, category: "therapy", region: "ذي قار", neighborhood: "الحي", subArea: "الحي الشرقي", provider: "حسين صالح" },
    { id: 14, name: "قسطرة وتشخيص", icon: "🫀", price: 250, rating: 4.9, category: "emergency", region: "ذي قار", neighborhood: "الحي", subArea: "الحي الغربي", provider: "د. علي محمد" },
    { id: 15, name: "رعاية مسنين", icon: "🧓", price: 45, rating: 4.7, category: "nursing", region: "ذي قار", neighborhood: "سوق الشيوخ", subArea: "السوق الرئيسي", provider: "ليلى عبدالقادر" },
    { id: 16, name: "فحوصات منزلية", icon: "🏠", price: 80, rating: 4.8, category: "lab", region: "ذي قار", neighborhood: "سوق الشيوخ", subArea: "الشارع الجديد", provider: "خديجة حسن" },
    { id: 17, name: "استشارة تغذية", icon: "🍎", price: 50, rating: 4.7, category: "nursing", region: "ذي قار", neighborhood: "الرفاعي", subArea: "الرفاعي الجديدة", provider: "نور الهدى" },
    { id: 18, name: "علاج الجروح", icon: "🩹", price: 60, rating: 4.8, category: "nursing", region: "ذي قار", neighborhood: "الدروة", subArea: "الدروة الغربية", provider: "محمد جاسم" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.includes(searchQuery) || service.provider.includes(searchQuery);
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesPrice = service.price <= priceRange;
    const matchesRating = service.rating >= rating;
    const matchesRegion = !selectedRegion || service.region === selectedRegion;
    const matchesNeighborhood = !selectedNeighborhood || service.neighborhood === selectedNeighborhood;
    const matchesSubArea = !selectedSubArea || service.subArea === selectedSubArea;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesRegion && matchesNeighborhood && matchesSubArea;
  });

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
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{t("searchAndFilter", language)}</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Search Bar ===== */}
      <div className="px-6 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none"
          />
          <span className="absolute left-4 top-4 text-2xl">🔍</span>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="px-6 py-4 space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">التصنيف</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "الكل", value: "" },
              { label: "التمريض", value: "nursing" },
              { label: "المختبر", value: "lab" },
              { label: "العلاج", value: "therapy" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`py-3 px-4 rounded-2xl font-bold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border-2 border-blue-200 text-gray-800 hover:border-blue-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">📍 المحافظة</h3>
          <select 
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedNeighborhood(""); // Reset neighborhood when region changes
            }}
            className="w-full py-3 px-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-800 font-semibold"
          >
            <option value="">جميع المحافظات</option>
            {iraqiRegions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Neighborhood Filter */}
        {selectedRegion && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏘️ الحي / المنطقة</h3>
            <select 
              value={selectedNeighborhood}
              onChange={(e) => {
                setSelectedNeighborhood(e.target.value);
                setSelectedSubArea(""); // Reset sub-area when neighborhood changes
              }}
              className="w-full py-3 px-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-800 font-semibold"
            >
              <option value="">جميع الأحياء</option>
              {neighborhoodsByRegion[selectedRegion]?.map((neighborhood: string) => (
                <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sub-Area Filter */}
        {selectedNeighborhood && subAreasByNeighborhood[selectedNeighborhood] && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏢 المنطقة الفرعية</h3>
            <select 
              value={selectedSubArea}
              onChange={(e) => setSelectedSubArea(e.target.value)}
              className="w-full py-3 px-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-800 font-semibold"
            >
              <option value="">جميع المناطق</option>
              {subAreasByNeighborhood[selectedNeighborhood]?.map((subArea: string) => (
                <option key={subArea} value={subArea}>{subArea}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t("price", language)} (0 - {priceRange} د.ع)</h3>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t("minimumRating", language)}</h3>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5, 5].map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  rating === r
                    ? "bg-yellow-400 text-white shadow-lg"
                    : "bg-yellow-100 text-gray-800 hover:bg-yellow-200"
                }`}
              >
                ⭐ {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Results ===== */}
      <div className="px-6 py-6 pb-32">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {t("results", language)} ({filteredServices.length})
        </h3>
        <div className="space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => router.push(`/service-details?id=${service.id}`)}
                className="w-full p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-right"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{service.icon}</span>
                  <h4 className="text-lg font-bold text-gray-800">{service.name}</h4>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  👤 {service.provider}
                </div>
                <div className="text-sm text-emerald-600 mb-3">
                  📍 {service.region} - {service.neighborhood}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-500">⭐ {service.rating}</span>
                  <span className="text-blue-600 font-bold">{service.price} د.ع</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-gray-600 text-lg">لا توجد نتائج تطابق بحثك</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      <PatientBottomNav language={language} />

      {/* Provider Bottom Navigation */}
      {providerAuth?.isLoggedIn && <ProviderBottomNav language={language} />}
      <div className="h-20"></div>
    </div>
  );
}
