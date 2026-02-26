"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/translations";
import PatientBottomNav from "@/components/PatientBottomNav";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function PatientServices() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [firstAidOpen, setFirstAidOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedLanguage = localStorage.getItem("language") || "ar";
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      const newDarkMode = localStorage.getItem("darkMode") === "true";
      const newLanguage = localStorage.getItem("language") || "ar";
      setDarkMode(newDarkMode);
      setLanguage(newLanguage);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const services = [
    {
      id: 1,
      name: "ممرض منزلي",
      icon: "💙",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      price: "50 د.ع/ساعة",
    },
    {
      id: 2,
      name: "فحوصات مختبرية",
      icon: "🧪",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      price: "100 د.ع",
    },
    {
      id: 3,
      name: "علاج فيزيائي",
      icon: "🧘",
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      price: "75 د.ع/جلسة",
    },
    {
      id: 4,
      name: "إسعافات أولية",
      icon: "🚑",
      color: "from-rose-400 to-rose-600",
      bgColor: "bg-rose-50",
      price: "معلومات طبية",
    },
  ];

  // بيانات الإسعافات الأولية مرتبة حسب الحالات المرضية
  const firstAidConditions = [
    {
      id: 1,
      name: "النزيف الحاد",
      icon: "🔴",
      color: "from-red-400 to-red-600",
      steps: [
        "توقف عن النشاط فوراً واستلقِ",
        "ارفع المنطقة المصابة فوق مستوى القلب",
        "اضغط على الجرح بضمادة نظيفة بقوة",
        "غير الضمادة إذا امتلأت بالدم، وأضف ضمادة جديدة فوقها",
        "استمر في الضغط لمدة 10-15 دقيقة",
        "اطلب سيارة إسعاف فوراً إذا استمر النزيف",
      ]
    },
    {
      id: 2,
      name: "الحروق",
      icon: "🔥",
      color: "from-orange-400 to-orange-600",
      steps: [
        "أبعد المصاب عن مصدر الحرارة فوراً",
        "أزل الملابس المحترقة بحذر (إذا لم تلتصق بالجلد)",
        "برد الحرق بماء بارد (لا ثلج) لمدة 15-20 دقيقة",
        "لا تفرقع الفقاعات إن وجدت",
        "غطِ الحرق بضمادة معقمة جافة",
        "أعط المصاب مسكناً للألم",
        "احصل على رعاية طبية للحروق الشديدة",
      ]
    },
    {
      id: 3,
      name: "الاختناق",
      icon: "😤",
      color: "from-cyan-400 to-cyan-600",
      steps: [
        "أزل الجسم الغريب من الحلق بحذر إن أمكن",
        "قف خلف المصاب وامسك حزام الأمان",
        "ضع يديك فوق السرة وتحت القفص الصدري",
        "اسحب بقوة نحوك وللأعلى بحركة سريعة",
        "كرر الحركة 5 مرات",
        "إذا لم يتنفس، ابدأ بالإنعاش القلبي الرئوي",
        "اطلب سيارة إسعاف فوراً",
      ]
    },
    {
      id: 4,
      name: "السقوط والكسور",
      icon: "🩼",
      color: "from-amber-400 to-amber-600",
      steps: [
        "لا تحرك المصاب إلا إذا كان في خطر فوري",
        "افحص وعي المصاب والتنفس",
        "أوقف أي نزيف بواسطة ضمادة معقمة",
        "ثبت الطرف المصاب باستخدام رباط أو جبيرة",
        "ضع الثلج على المنطقة لتقليل الورم",
        "لا تعطِ الطعام أو الماء",
        "اطلب سيارة إسعاف فوراً",
      ]
    },
    {
      id: 5,
      name: "السكتة القلبية",
      icon: "❤️",
      color: "from-pink-400 to-pink-600",
      steps: [
        "اتصل برقم الطوارئ 911 فوراً",
        "تأكد من وعي المصاب وتنفسه",
        "ضع المصاب على سطح صلب",
        "افتح مجرى الهواء برفع الذقن",
        "ابدأ الضغط على الصدر: 100-120 نبضة في الدقيقة",
        "بدل مع التنفس الصناعي بنسبة 30:2",
        "استمر حتى وصول الإسعاف",
      ]
    },
    {
      id: 6,
      name: "التسمم",
      icon: "☠️",
      color: "from-purple-400 to-purple-600",
      steps: [
        "اتصل برقم الطوارئ فوراً",
        "حدد ما تم تناوله إن أمكن",
        "لا تحاول تحفيز القيء إذا كان سماً حمضياً",
        "أعطِ المصاب الفحم النشط إذا توفر",
        "أزل الملابس الملوثة برفق",
        "اغسل الجلد بماء وصابون",
        "ضع المصاب في وضعية الإفاقة (على جانبه)",
      ]
    },
    {
      id: 7,
      name: "الإغماء",
      icon: "😵",
      color: "from-indigo-400 to-indigo-600",
      steps: [
        "ضع المصاب على ظهره",
        "ارفع ساقيه فوق مستوى الرأس بـ 12 بوصة",
        "قدم هواء نقياً - فتح النوافذ",
        "فك الملابس الضيقة",
        "لا تعطِ ماء أو طعام حتى يستعيد الوعي",
        "عند الاستعادة، دعه يستريح",
        "اطلب مساعدة طبية إذا استمر الإغماء",
      ]
    },
    {
      id: 8,
      name: "الحساسية الشديدة",
      icon: "🤧",
      color: "from-green-400 to-green-600",
      steps: [
        "توقف عن التعرض للمادة المسببة",
        "أعطِ مضاد الهيستامين إن توفر",
        "راقب التنفس والدورة الدموية",
        "إذا كان لديه حاقن الإيبينفرين (EpiPen)، استخدمه",
        "اطلب سيارة إسعاف إذا ازدادت الأعراض",
        "ضع المصاب في وضعية الإفاقة",
        "قدم دعماً نفسياً وطمأنة",
      ]
    },
  ];

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gray-800" : "border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => {
              if (firstAidOpen) {
                if (selectedCondition !== null) {
                  setSelectedCondition(null);
                } else {
                  setFirstAidOpen(false);
                }
              } else {
                router.back();
              }
            }}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {firstAidOpen ? "إسعافات أولية" : "الخدمات"}
          </h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Hero Banner ===== */}
      {!firstAidOpen && (
        <div className="px-6 pt-6 pb-4">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-0.5 shadow-xl overflow-hidden">
            <div className="relative bg-white rounded-3xl overflow-hidden">
              <Image
                src="/fff.jpg"
                alt="خدماتنا"
                width={800}
                height={300}
                priority
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Title Section ===== */}
      {!firstAidOpen && (
        <div className="px-6 py-6 text-center">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-2`}>{t("selectAppropriateService", language)}</h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>نقدم أفضل الخدمات الطبية المتخصصة</p>
        </div>
      )}

      {/* ===== My Orders Quick Access ===== */}
      {!firstAidOpen && (
        <div className="px-6 mb-6">
          <button
            onClick={() => router.push("/my-orders")}
            className="w-full rounded-2xl transition-all duration-300 transform hover:scale-102 active:scale-95"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg rounded-2xl p-0.5">
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-5`}>
                <div className="flex items-center gap-5">
                  <div className={`flex-shrink-0 flex items-center justify-center rounded-2xl ${darkMode ? "bg-amber-900/30" : "bg-amber-50"} p-4`}>
                    <span className="text-4xl">📋</span>
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-1`}>طلباتي</h3>
                    <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>اطلع على طلباتك المقبولة</p>
                  </div>
                  <div className={`flex-shrink-0 text-2xl ${darkMode ? "text-gray-500" : "text-gray-400"}`}>›</div>
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ===== Title Section ===== */}

      {/* ===== Services Grid ===== */}
      {!firstAidOpen ? (
        <div className={`px-6 space-y-4 pb-24 ${darkMode ? "bg-gray-900" : ""}`}>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service.id);
                if (service.id === 4) {
                  // فتح صفحة الإسعافات الأولية
                  setFirstAidOpen(true);
                } else {
                  setTimeout(() => router.push(`/service-details?id=${service.id}`), 300);
                }
              }}
              className={`w-full rounded-2xl transition-all duration-300 transform overflow-hidden ${
                selectedService === service.id ? "scale-95" : "hover:scale-102 active:scale-95"
              }`}
            >
              <div className={`bg-gradient-to-r ${service.color} shadow-lg rounded-2xl p-0.5`}>
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-5`}>
                  <div className="flex items-center gap-5">
                    <div className={`flex-shrink-0 flex items-center justify-center rounded-2xl ${service.bgColor} p-4`}>
                      <span className="text-4xl">{service.icon}</span>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-1`}>{service.name}</h3>
                      <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-600"}>{service.price}</p>
                    </div>
                    <div className={`flex-shrink-0 text-2xl ${darkMode ? "text-gray-500" : "text-gray-400"}`}>›</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* ===== First Aid Information Page ===== */
        <div className={`px-6 py-6 pb-24 ${darkMode ? "bg-gray-900" : ""}`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>معلومات الإسعافات الأولية</h2>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>{t("selectConditionForFirstAid", language)}</p>
          </div>

          {/* First Aid Conditions Grid */}
          {selectedCondition === null ? (
            <div className="space-y-4">
              {firstAidConditions.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => setSelectedCondition(condition.id)}
                  className="w-full rounded-2xl transition-all duration-300 transform hover:scale-102 active:scale-95"
                >
                  <div className={`bg-gradient-to-r ${condition.color} shadow-lg rounded-2xl p-0.5`}>
                    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-5`}>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 text-4xl">{condition.icon}</div>
                        <div className="flex-1 text-right">
                          <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{condition.name}</h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>خطوات طبية مفصلة</p>
                        </div>
                        <div className={`flex-shrink-0 text-2xl ${darkMode ? "text-gray-500" : "text-gray-400"}`}>›</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* ===== Detailed First Aid Steps ===== */
            <div className="space-y-6">
              {firstAidConditions
                .filter((c) => c.id === selectedCondition)
                .map((condition) => (
                  <div key={condition.id}>
                    <div className={`bg-gradient-to-r ${condition.color} rounded-2xl p-0.5 mb-6`}>
                      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6`}>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-5xl">{condition.icon}</span>
                          <h2 className={`text-3xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{condition.name}</h2>
                        </div>
                        <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>خطوات الإسعاف الأولي الصحيحة والعملية</p>
                      </div>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-3">
                      {condition.steps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex gap-4 p-5 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-md border-r-4 hover:shadow-lg transition-all`}
                          style={{
                            borderRightColor: condition.color.includes("red") ? "#ef4444" : 
                            condition.color.includes("orange") ? "#f97316" :
                            condition.color.includes("cyan") ? "#06b6d4" :
                            condition.color.includes("amber") ? "#f59e0b" :
                            condition.color.includes("pink") ? "#ec4899" :
                            condition.color.includes("purple") ? "#a855f7" :
                            condition.color.includes("indigo") ? "#6366f1" :
                            "#22c55e"
                          }}
                        >
                          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} font-semibold leading-relaxed`}>{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Important Note */}
                    <div className={`mt-6 p-5 ${darkMode ? "bg-yellow-900/20 border-yellow-800" : "bg-yellow-50 border-yellow-300"} rounded-2xl border-2`}>
                      <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">⚠️</span>
                        <div>
                          <h4 className={`font-bold ${darkMode ? "text-yellow-400" : "text-yellow-900"} mb-2`}>تذكر دائماً</h4>
                          <ul className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-800"} space-y-1`}>
                            <li>✓ اطلب سيارة إسعاف فوراً في أي حالة طوارئ</li>
                            <li>✓ الإسعافات الأولية تهدف لتثبيت الحالة فقط</li>
                            <li>✓ احصل على التدريب الطبي المناسب</li>
                            <li>✓ لا تتردد في طلب المساعدة المتخصصة</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedCondition(null)}
                      className={`w-full mt-6 py-4 bg-gradient-to-r ${darkMode ? "from-gray-700 to-gray-800" : "from-gray-400 to-gray-600"} text-white rounded-2xl font-bold hover:shadow-lg transition-all`}
                    >
                      العودة للحالات الأخرى
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ===== Bottom Navigation ===== */}
      <PatientBottomNav language={language} />
      <div className="h-20"></div>
    </div>
  );
}
