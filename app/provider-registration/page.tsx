"use client";

import { Cairo } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProviderBottomNav from "@/components/ProviderBottomNav";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function ProviderRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerType = searchParams.get("type") || "1";
  const [step, setStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [providerAuth, setProviderAuth] = useState<any>(null);
  const [providerData, setProviderData] = useState<any>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    region: "",
    neighborhood: "",
    license: "",
    issuingBody: "",
    clinicName: "",
    experience: "",
    bio: "",
    accountHolder: "",
    iban: "",
    bank: "",
    pin: "",
    termsAccepted: false,
    privacyAccepted: false,
    services: []
  });

  // Define regions in Iraq
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
  
  // Define services based on provider type
  const availableServices: any = {
    1: [ // طبيب
      { id: "consultation", name: "استشارة طبية عامة", icon: "🩺", price: 0 },
      { id: "followup", name: "متابعة المريض", icon: "📋", price: 0 },
      { id: "prescription", name: "كتابة الوصفات الطبية", icon: "💊", price: 0 },
      { id: "diagnostics", name: "التشخيص والتحليل", icon: "🔬", price: 0 },
      { id: "minor", name: "الإجراءات الطبية البسيطة", icon: "✂️", price: 0 }
    ],
    2: [ // ممرض
      { id: "nursing", name: "تمريض منزلي عام", icon: "👩‍⚕️", price: 0 },
      { id: "injection", name: "إعطاء الحقن", icon: "💉", price: 0 },
      { id: "pressure", name: "قياس الضغط والسكر", icon: "📊", price: 0 },
      { id: "bandage", name: "تغيير الضمادات", icon: "🩹", price: 0 },
      { id: "medication", name: "تحضير الأدوية", icon: "💊", price: 0 }
    ],
    3: [ // معالج فيزيائي
      { id: "therapy", name: "العلاج الطبيعي", icon: "🏃‍♂️", price: 0 },
      { id: "massage", name: "المساج العلاجي", icon: "💆‍♂️", price: 0 },
      { id: "exercises", name: "تمارين علاجية", icon: "💪", price: 0 },
      { id: "rehabilitation", name: "إعادة التأهيل", icon: "🔄", price: 0 }
    ],
    4: [ // فني مختبر
      { id: "bloodtest", name: "فحص الدم", icon: "🩸", price: 0 },
      { id: "urinalysis", name: "تحليل البول", icon: "🧪", price: 0 },
      { id: "cultures", name: "الزراعات والأنسجة", icon: "🔬", price: 0 },
      { id: "samples", name: "أخذ العينات", icon: "🧫", price: 0 }
    ]
  };
  const [messages, setMessages] = useState<any[]>([
    { id: 1, sender: "patient", text: "السلام عليكم، شكراً على قبول طلبي 🙏", time: "14:35" },
    { id: 2, sender: "patient", text: "كم الوقت المتوقع للوصول؟", time: "14:36" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [showRating, setShowRating] = useState(false);
  const [ratingAction, setRatingAction] = useState<"accept" | "reject" | null>(null);
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [privacyAlertAccepted, setPrivacyAlertAccepted] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  const providerTypes: any = {
    1: { name: "طبيب", icon: "👨‍⚕️", color: "from-blue-400 to-blue-600" },
    2: { name: "ممرض", icon: "👩‍⚕️", color: "from-purple-400 to-purple-600" },
    3: { name: "معالج فيزيائي", icon: "🏃‍♂️", color: "from-emerald-400 to-emerald-600" },
    4: { name: "فني مختبر", icon: "🔬", color: "from-rose-400 to-rose-600" },
  };

  const provider = providerTypes[providerType] || providerTypes[1];

  // Check if provider is logged in and open dashboard directly
  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        setProviderAuth(parsedAuth);
        if (parsedAuth.isLoggedIn) {
          // Open dashboard directly for logged-in provider
          setRegistrationComplete(true);
        }
      } catch (e) {
        console.error("Error parsing provider auth:", e);
      }
    }

    // Load dark mode and language preferences
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
    
    // Show privacy alert on component load
    const hasShownPrivacyAlert = sessionStorage.getItem("privacyAlertShown");
    if (!hasShownPrivacyAlert) {
      // Delay the alert to ensure the component is fully mounted
      setTimeout(() => {
        setShowPrivacyAlert(true);
        setPrivacyAlertAccepted(false);
      }, 500);
    } else {
      setShowPrivacyAlert(false);
      setPrivacyAlertAccepted(true);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-reject when time runs out
          handleAutoReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Auto-reject function
  const handleAutoReject = () => {
    setTimerActive(false);
    setRatingAction("reject");
    setShowRating(true);
  };

  // Accept request handler
  const handleAcceptRequest = () => {
    setTimerActive(false);
    setRatingAction("accept");
    setShowRating(true);
  };

  // Reject request handler
  const handleRejectRequest = () => {
    setTimerActive(false);
    setRatingAction("reject");
    setShowRating(true);
  };

  // Close rating and go back to requests
  const handleCloseRating = () => {
    setShowRating(false);
    setRatingAction(null);
    setSelectedRequest(null);
    setTimeRemaining(120);
    setChatOpen(false);
  };

  // Handle service selection and pricing
  const handleServiceChange = (serviceId: string, price: number) => {
    const existingService = providerData.services.find((s: any) => s.id === serviceId);
    
    if (existingService) {
      // Remove service if it already exists
      setProviderData({
        ...providerData,
        services: providerData.services.filter((s: any) => s.id !== serviceId)
      });
    } else {
      // Add service with price
      setProviderData({
        ...providerData,
        services: [...providerData.services, { id: serviceId, price }]
      });
    }
  };

  const requests = [
    {
      id: 1,
      patientName: "محمد أحمد",
      patientAge: 45,
      patientPhone: "0501234567",
      serviceType: "تمريض منزلي",
      selectedServices: [
        { id: "general", name: "تمريض عام", price: 50 },
        { id: "pressure", name: "قياس الضغط والسكر", price: 35 },
        { id: "injection", name: "إعطاء الحقن", price: 30 }
      ],
      addOns: [
        { id: "medication", name: "تحضير الأدوية وإعطاؤها", price: 20 }
      ],
      date: "29 يناير 2026",
      time: "14:30",
      location: "حي القدس، الرياض",
      notes: "المريض يعاني من ارتفاع في ضغط الدم",
      totalPrice: 165,
      status: "جديد"
    },
    {
      id: 2,
      patientName: "فاطمة علي",
      patientAge: 32,
      patientPhone: "0502345678",
      serviceType: "قياس الضغط والسكر",
      selectedServices: [
        { id: "pressure", name: "قياس الضغط والسكر", price: 35 }
      ],
      addOns: [
        { id: "monitoring", name: "مراقبة دورية كل ساعة", price: 25 }
      ],
      date: "29 يناير 2026",
      time: "15:00",
      location: "حي الهدا، الرياض",
      notes: "تابعة مستمرة للسكر",
      totalPrice: 60,
      status: "قيد الانتظار"
    },
    {
      id: 3,
      patientName: "سارة محمود",
      patientAge: 28,
      patientPhone: "0503456789",
      serviceType: "تغيير الضمادات",
      selectedServices: [
        { id: "bandage", name: "تغيير الضمادات", price: 40 }
      ],
      addOns: [
        { id: "wound", name: "تنظيف والعناية بالجروح", price: 30 }
      ],
      date: "28 يناير 2026",
      time: "10:00",
      location: "حي الملقا، الرياض",
      notes: "عملية جراحية صغيرة تحتاج إلى عناية",
      totalPrice: 70,
      status: "مقبول"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "المعلومات الشخصية",
      icon: "👤",
    },
    {
      number: 2,
      title: "البيانات المهنية",
      icon: "📋",
    },
    {
      number: 3,
      title: "الخدمات والأسعار",
      icon: "💰",
    },
    {
      number: 4,
      title: "الوثائق والشهادات",
      icon: "📄",
    },
    {
      number: 5,
      title: "معلومات الحساب",
      icon: "🔐",
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "provider",
        text: newMessage,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // رد من المريض بعد ثانيتين
      setTimeout(() => {
        const responses = [
          "حسناً، شكراً لك 😊",
          "تمام، أنا في انتظارك 👍",
          "شكراً على اهتمامك ❤️",
          "وافق، سأكون جاهزاً ✅"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const patientReply = {
          id: messages.length + 2,
          sender: "patient",
          text: randomResponse,
          time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, patientReply]);
      }, 2000);
    }
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-emerald-50 via-teal-50 to-white"} ${cairo.className}`}
    >
      {/* ===== Privacy Policy Alert Modal ===== */}
      {showPrivacyAlert && !privacyAlertAccepted && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-lg flex items-center justify-center p-4">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4`}>
            {/* Alert Header */}
            <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-red-600 text-white p-8 rounded-t-3xl">
              <div className="text-center">
                <span className="text-5xl block mb-4">🔒 سياسة الخصوصية</span>
                <p className="text-lg font-bold">شرط إلزامي لتسجيل مقدمي الخدمات</p>
              </div>
            </div>

            {/* Alert Content */}
            <div className={`p-8 space-y-6 ${darkMode ? "text-white" : "text-gray-800"}`} dir={language === "ar" ? "rtl" : "ltr"}>
              <div className={`rounded-2xl p-6 border-2 ${darkMode ? "bg-rose-900/20 border-rose-700/50 text-rose-100" : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 text-gray-800"}`}>
                <p className={`text-lg leading-relaxed font-semibold`}>
                  قبل الاستمرار في عملية التسجيل، يجب عليك قراءة والموافقة على سياسة الخصوصية الخاصة بنا.
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-4">
                <h3 className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>🔑 أهم النقاط:</h3>
                
                <div className={`flex gap-4 p-4 rounded-xl border-r-4 ${darkMode ? "bg-blue-900/20 border-blue-700/50" : "bg-blue-50 border-blue-500"}`}>
                  <span className="text-3xl flex-shrink-0">🛡️</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-blue-200" : "text-gray-800"} mb-1`}>حماية البيانات الشخصية</p>
                    <p className={`text-sm ${darkMode ? "text-blue-100" : "text-gray-700"}`}>نحن ملتزمون بحماية جميع بيانات المرضى والمتخصصين بأعلى معايير الأمان والتشفير</p>
                  </div>
                </div>

                <div className={`flex gap-4 p-4 rounded-xl border-r-4 ${darkMode ? "bg-purple-900/20 border-purple-700/50" : "bg-purple-50 border-purple-500"}`}>
                  <span className="text-3xl flex-shrink-0">📋</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-purple-200" : "text-gray-800"} mb-1`}>السرية الطبية</p>
                    <p className={`text-sm ${darkMode ? "text-purple-100" : "text-gray-700"}`}>جميع المعلومات الطبية والشخصية سرية تماماً ولن تُشارك مع أطراف ثالثة دون موافقتك</p>
                  </div>
                </div>

                <div className={`flex gap-4 p-4 rounded-xl border-r-4 ${darkMode ? "bg-green-900/20 border-green-700/50" : "bg-green-50 border-green-500"}`}>
                  <span className="text-3xl flex-shrink-0">⚖️</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-green-200" : "text-gray-800"} mb-1`}>الالتزام القانوني</p>
                    <p className={`text-sm ${darkMode ? "text-green-100" : "text-gray-700"}`}>تعهد منك بالالتزام بجميع القوانين والأنظمة الطبية والمحلية ذات الصلة</p>
                  </div>
                </div>

                <div className={`flex gap-4 p-4 rounded-xl border-r-4 ${darkMode ? "bg-amber-900/20 border-amber-700/50" : "bg-amber-50 border-amber-500"}`}>
                  <span className="text-3xl flex-shrink-0">✅</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-amber-200" : "text-gray-800"} mb-1`}>معايير الممارسة</p>
                    <p className={`text-sm ${darkMode ? "text-amber-200" : "text-gray-700"}`}>تعهد بالالتزام بأعلى معايير الممارسة الطبية والأخلاقية المهنية</p>
                  </div>
                </div>

                <div className={`flex gap-4 p-4 rounded-xl border-r-4 ${darkMode ? "bg-pink-900/20 border-pink-700/50" : "bg-pink-50 border-pink-500"}`}>
                  <span className="text-3xl flex-shrink-0">📱</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-pink-200" : "text-gray-800"} mb-1`}>استخدام البيانات</p>
                    <p className={`text-sm ${darkMode ? "text-pink-100" : "text-gray-700"}`}>بيانات الملف الشخصي تُستخدم فقط لأغراض التطبيق والتواصل المتعلق بالخدمات الطبية</p>
                  </div>
                </div>
              </div>

              {/* Full Policy Link */}
              <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  هذا ملخص السياسة. لقراءة النص الكامل، 
                  <button className="text-blue-600 font-bold hover:underline"> اضغط هنا</button>
                </p>
              </div>

              {/* Warning Box */}
              <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-red-900/20 border-red-700/50" : "bg-gradient-to-r from-red-50 to-orange-50 border-red-400"}`}>
                <div className="flex gap-3">
                  <span className="text-3xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className={`font-bold ${darkMode ? "text-red-300" : "text-red-700"} mb-2`}>تنبيه مهم</p>
                    <p className={`text-sm ${darkMode ? "text-red-200" : "text-red-600"}`}>
                      عدم الموافقة على سياسة الخصوصية سيؤدي إلى عدم تتمكنك من إكمال التسجيل. الموافقة على هذه السياسة ضرورية للاستمرار كمقدم خدمة على منصتنا.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Statement */}
              <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-emerald-900/20 border-emerald-700/50" : "bg-emerald-50 border-emerald-300"}`}>
                <p className={`text-center font-semibold ${darkMode ? "text-emerald-200" : "text-gray-800"}`}>
                  بالموافقة على هذه السياسة، فإنك تقر بأنك قرأت وفهمت وتوافق على جميع الشروط المذكورة أعلاه.
                </p>
              </div>
            </div>

            {/* Alert Footer with Buttons */}
            <div className={`sticky bottom-0 border-t-2 p-6 rounded-b-3xl space-y-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <button
                onClick={() => {
                  setPrivacyAlertAccepted(true);
                  sessionStorage.setItem("privacyAlertShown", "true");
                  setShowPrivacyAlert(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all active:scale-95"
              >
                ✅ أوافق على السياسة والشروط
              </button>
              <button
                onClick={() => {
                  router.back();
                }}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-all active:scale-95"
              >
                ❌ رفض والعودة
              </button>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} text-center`}>
                لا يمكن متابعة التسجيل دون الموافقة على السياسة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Only show content after accepting privacy policy */}
      {privacyAlertAccepted && (
      <>
      {/* ===== Header ===== */}
      <header className={`sticky top-0 z-50 border-b-2 ${darkMode ? "border-gray-700 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" : "border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500"} shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => {
              if (registrationComplete && providerAuth?.isLoggedIn) {
                router.push("/");
              } else if (registrationComplete) {
                setRegistrationComplete(false);
                setStep(1);
              } else {
                router.back();
              }
            }}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {registrationComplete ? "الطلبات الواردة" : "التسجيل"}
          </h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Registration Complete Screen ===== */}
      {registrationComplete ? (
        <div className="px-6 py-6 pb-32">
          {/* Welcome Banner for Logged-in Provider */}
          {providerAuth?.isLoggedIn && providerAuth?.provider && (
            <div className="mb-6 p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{providerAuth.provider.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold mb-1">مرحباً بعودتك!</h2>
                  <p className="text-emerald-50">
                    {providerAuth.provider.firstName} {providerAuth.provider.lastName} - {providerAuth.provider.specialization}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show Request Details if Selected */}
          {selectedRequest && !showRating ? (
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex items-center gap-2 text-emerald-600 font-bold mb-4"
              >
                <span className="text-xl">←</span>
                العودة للطلبات
              </button>

              {/* Countdown Timer */}
              {timerActive && (
                <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-300 shadow-lg">
                  <div className="text-center">
                    <p className="text-red-600 font-bold mb-2">⏱️ الوقت المتبقي</p>
                    <div className="text-5xl font-bold text-red-600 font-mono mb-2">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-red-500 text-sm">سيتم إرسال رفض تلقائي عند انتهاء الوقت</p>
                  </div>
                </div>
              )}

              {/* Request Details */}
              <div className={`p-6 rounded-2xl shadow-md border-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-emerald-200"}`}>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-6`}>تفاصيل الطلب</h2>

                {/* Patient Info */}
                <div className={`mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>معلومات المريض</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>الاسم:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>العمر:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.patientAge} سنة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>رقم الهاتف:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.patientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className={`mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>الخدمات المطلوبة</h3>
                  <div className="space-y-2">
                    {selectedRequest.selectedServices.map((service: any) => (
                      <div key={service.id} className={`flex justify-between p-3 rounded-xl ${darkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                        <span className={darkMode ? "text-blue-200" : "text-gray-700"}>{service.name}</span>
                        <span className="font-bold text-blue-600">{service.price} د.ع</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                {selectedRequest.addOns.length > 0 && (
                  <div className={`mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>خدمات إضافية</h3>
                    <div className="space-y-2">
                      {selectedRequest.addOns.map((addon: any) => (
                        <div key={addon.id} className={`flex justify-between p-3 rounded-xl ${darkMode ? "bg-purple-900/20" : "bg-purple-50"}`}>
                          <span className={darkMode ? "text-purple-200" : "text-gray-700"}>{addon.name}</span>
                          <span className="font-bold text-purple-600">{addon.price} د.ع</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointment Details */}
                <div className={`mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>تفاصيل الموعد</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>التاريخ:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>الوقت:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>الموقع:</span>
                      <span className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedRequest.location}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className={`mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>ملاحظات المريض</h3>
                  <p className={`p-4 rounded-xl border-l-4 ${darkMode ? "bg-yellow-900/20 border-yellow-700 text-yellow-200" : "bg-yellow-50 border-yellow-400 text-gray-700"}`}>
                    {selectedRequest.notes}
                  </p>
                </div>

                {/* Total Price */}
                <div className={`p-5 rounded-xl border-2 mb-6 ${darkMode ? "bg-emerald-900/20 border-emerald-700" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                    <span className="text-3xl font-bold text-emerald-600">{selectedRequest.totalPrice} د.ع</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleRejectRequest}
                    className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    رفض الطلب
                  </button>
                  <button 
                    onClick={() => {
                      setTimerActive(true);
                      setTimeRemaining(120);
                      handleAcceptRequest();
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    ✅ قبول الطلب (120s)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Success Message */}
              <div className={`p-6 rounded-2xl border-2 mb-6 text-center ${darkMode ? "bg-green-900/20 border-green-700" : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"}`}>
                <span className="text-5xl mb-3 block">✅</span>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-green-300" : "text-green-700"} mb-2`}>تم التسجيل بنجاح!</h2>
                <p className={darkMode ? "text-green-200" : "text-green-600"}>أهلاً وسهلاً بك في منصتنا</p>
              </div>

              {/* Provider Info Card */}
              <div className={`bg-gradient-to-r ${provider.color} rounded-2xl p-0.5 shadow-lg mb-6`}>
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-5`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{provider.icon}</span>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>أنت مسجل كـ</p>
                      <h3 className={`text-xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{provider.name}</h3>
                    </div>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>يمكنك الآن استقبال الطلبات من المرضى</p>
                </div>
              </div>

              {/* Requests List Header with Logout Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>الطلبات الواردة</h3>
                <button
                  onClick={() => {
                    localStorage.removeItem("providerAuth");
                    setProviderAuth(null);
                    setRegistrationComplete(false);
                    setStep(1);
                    router.push("/");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all text-sm"
                >
                  تسجيل الخروج
                </button>
              </div>
              
              {requests.map((request) => (
                <div key={request.id} className={`p-5 rounded-2xl shadow-md mb-4 border-l-4 ${
                  request.status === "جديد" ? `border-blue-500 ${darkMode ? "bg-gray-800" : "bg-white"}` :
                  request.status === "قيد الانتظار" ? `border-amber-500 ${darkMode ? "bg-gray-800" : "bg-white"}` :
                  `border-green-500 ${darkMode ? "bg-gray-800" : "bg-white"}`
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{request.patientName}</h4>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>طلب: {request.serviceType}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      request.status === "جديد" ? darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-600" :
                      request.status === "قيد الانتظار" ? darkMode ? "bg-amber-900/30 text-amber-300" : "bg-amber-100 text-amber-600" :
                      darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-600"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-700"} mb-3`}>التاريخ: {request.date} - الوقت: {request.time}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>الموقع: {request.location}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                    >
                      قبول الطلب
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRequest(request);
                        // Set state to show rating directly with reject action
                        setTimeout(() => {
                          setRatingAction("reject");
                          setShowRating(true);
                        }, 0);
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                    >
                      رفض الطلب
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

        {/* ===== RATING SCREEN ===== */}
        {showRating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {ratingAction === "accept" ? "✅ تم قبول الطلب" : "❌ تم رفض الطلب"}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {ratingAction === "accept" 
                  ? "سيقوم المريض بتقييم تجربتك. برجاء الانتظار" 
                  : "تم إرسال رفض الطلب للمريض. سيتمكن من البحث عن مقدم خدمة آخر"}
              </p>

              {/* Countdown Timer for Accept */}
              {ratingAction === "accept" && timerActive && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border-2 border-blue-300 shadow-lg mb-6">
                  <div className="text-center">
                    <p className="text-blue-600 font-bold mb-3 text-lg">⏱️ الوقت المتبقي للرد</p>
                    <div className="text-6xl font-bold text-blue-600 font-mono mb-4 tracking-wider">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 transition-all"
                        style={{ width: `${(timeRemaining / 120) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-blue-500 text-sm mt-3">سيتم رفض الطلب تلقائياً عند انتهاء الوقت</p>
                  </div>
                </div>
              )}

              {/* Patient Info */}
              <div className="p-4 bg-blue-50 rounded-2xl mb-6">
                <p className="text-gray-600 text-sm mb-2">اسم المريض:</p>
                <p className="text-lg font-bold text-gray-800">{selectedRequest?.patientName}</p>
              </div>

              {/* Patient Rating Section */}
              {ratingAction === "accept" && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                  <p className="text-gray-700 font-bold mb-4 text-center">⭐ تقييم المريض</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-4xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm text-center mb-3">قيد الانتظار...</p>
                  <textarea
                    placeholder="تعليق المريض..."
                    disabled
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 resize-none h-20"
                  />
                </div>
              )}

              {/* Action Message */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl mb-6 border-2 border-emerald-200">
                <p className="text-sm text-gray-700 text-center">
                  {ratingAction === "accept" 
                    ? "سيتم إرسال بيانات التواصل الخاصة بك للمريض"
                    : "تم إخطار المريض برفضك للطلب"}
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCloseRating}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all mb-3"
              >
                تم، العودة للطلبات
              </button>
              
              <button
                onClick={handleCloseRating}
                className="w-full py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
        </div>
      ) : (
        <>
          {/* ===== Provider Type Card ===== */}
          <div className="px-6 py-6">
            <div className={`bg-gradient-to-r ${provider.color} rounded-2xl p-0.5 shadow-lg`}>
              <div className="bg-white rounded-2xl p-5 flex items-center gap-5">
                <span className="text-4xl">{provider.icon}</span>
                <div>
                  <p className="text-gray-600 text-sm">التسجيل كـ</p>
                  <h2 className="text-2xl font-bold text-gray-800">{provider.name}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Progress Indicator ===== */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setStep(s.number)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all mb-2 ${
                      s.number <= step
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.number}
                  </button>
                  <p className="text-xs text-gray-600 text-center">{s.icon}</p>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* ===== Form Content ===== */}
      <div className={`px-6 py-6 pb-32 ${darkMode ? "bg-gray-900" : ""}`}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>المعلومات الشخصية</h3>
            <input 
              type="text" 
              placeholder="الاسم الأول" 
              value={providerData.firstName}
              onChange={(e) => setProviderData({...providerData, firstName: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <input 
              type="text" 
              placeholder="اسم العائلة" 
              value={providerData.lastName}
              onChange={(e) => setProviderData({...providerData, lastName: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <select 
              value={providerData.gender}
              onChange={(e) => setProviderData({...providerData, gender: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <option value="">نوع الجنس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              value={providerData.email}
              onChange={(e) => setProviderData({...providerData, email: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <input 
              type="tel" 
              placeholder="رقم الهاتف" 
              value={providerData.phone}
              onChange={(e) => setProviderData({...providerData, phone: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <select 
              value={providerData.region}
              onChange={(e) => setProviderData({...providerData, region: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <option value="">اختر المحافظة / المنطقة</option>
              {iraqiRegions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="الحي / المنطقة السكنية" 
              value={providerData.neighborhood}
              onChange={(e) => setProviderData({...providerData, neighborhood: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>البيانات المهنية</h3>
            <input 
              type="text" 
              placeholder="رقم الترخيص" 
              value={providerData.license}
              onChange={(e) => setProviderData({...providerData, license: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <input 
              type="text" 
              placeholder="جهة الترخيص" 
              value={providerData.issuingBody}
              onChange={(e) => setProviderData({...providerData, issuingBody: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <input 
              type="text" 
              placeholder="اسم العيادة أو المركز" 
              value={providerData.clinicName}
              onChange={(e) => setProviderData({...providerData, clinicName: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`} 
            />
            <select 
              value={providerData.experience}
              onChange={(e) => setProviderData({...providerData, experience: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <option value="">سنوات الخبرة</option>
              <option value="أقل من سنة">أقل من سنة</option>
              <option value="1-3 سنوات">1-3 سنوات</option>
              <option value="3-5 سنوات">3-5 سنوات</option>
              <option value="أكثر من 5 سنوات">أكثر من 5 سنوات</option>
            </select>
            <textarea 
              placeholder="نبذة عنك" 
              rows={3} 
              value={providerData.bio}
              onChange={(e) => setProviderData({...providerData, bio: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:border-emerald-500 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600"}`}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>الخدمات والأسعار</h3>
            
            <div className={`p-4 rounded-xl ${darkMode ? "bg-blue-900/20 border-2 border-blue-700/50" : "bg-blue-50 border-2 border-blue-300"}`}>
              <p className={`text-sm font-semibold ${darkMode ? "text-blue-200" : "text-blue-700"}`}>
                💡 اختر الخدمات التي تقدمها وحدد سعر كل خدمة بالدينار
              </p>
            </div>

            <div className="space-y-3">
              {availableServices[providerType]?.map((service: any) => (
                <div key={service.id} className={`p-4 rounded-xl border-2 transition-all ${
                  providerData.services.find((s: any) => s.id === service.id)
                    ? darkMode ? "bg-emerald-900/30 border-emerald-700" : "bg-emerald-50 border-emerald-400"
                    : darkMode ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!providerData.services.find((s: any) => s.id === service.id)}
                      onChange={() => handleServiceChange(service.id, 0)}
                      className="w-5 h-5 mt-1 cursor-pointer accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{service.icon}</span>
                        <p className={`font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{service.name}</p>
                      </div>
                      
                      {providerData.services.find((s: any) => s.id === service.id) && (
                        <div className="mt-3 pt-3 border-t-2 border-current border-opacity-20">
                          <label className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"} block mb-2`}>
                            السعر (د.ع)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="أدخل السعر"
                            value={providerData.services.find((s: any) => s.id === service.id)?.price || 0}
                            onChange={(e) => {
                              const newServices = providerData.services.map((s: any) =>
                                s.id === service.id ? { ...s, price: parseFloat(e.target.value) || 0 } : s
                              );
                              setProviderData({ ...providerData, services: newServices });
                            }}
                            className={`w-full p-3 rounded-lg border-2 focus:outline-none ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                                : "bg-white border-gray-300 text-gray-800 placeholder-gray-600 focus:border-emerald-500"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {providerData.services.length === 0 && (
              <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-yellow-900/20 border-2 border-yellow-700/50" : "bg-yellow-50 border-2 border-yellow-300"}`}>
                <p className={`font-semibold ${darkMode ? "text-yellow-200" : "text-yellow-700"}`}>
                  ⚠️ يجب اختيار خدمة واحدة على الأقل
                </p>
              </div>
            )}

            <div className={`p-4 rounded-xl ${darkMode ? "bg-emerald-900/20 border-2 border-emerald-700/50" : "bg-emerald-50 border-2 border-emerald-300"}`}>
              <p className={`text-sm ${darkMode ? "text-emerald-200" : "text-emerald-700"}`}>
                <span className="font-bold">📊 ملخص الخدمات:</span> {providerData.services.length} خدمة مختارة
              </p>
              {providerData.services.length > 0 && (
                <div className="mt-2 text-sm space-y-1">
                  {providerData.services.map((service: any) => {
                    const serviceInfo = availableServices[providerType]?.find((s: any) => s.id === service.id);
                    return (
                      <p key={service.id} className={darkMode ? "text-emerald-300" : "text-emerald-600"}>
                        • {serviceInfo?.icon} {serviceInfo?.name}: {service.price.toLocaleString()} د.ع
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>الوثائق والشهادات</h3>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:cursor-pointer transition-all ${darkMode ? "border-emerald-700 hover:bg-emerald-900/20" : "border-emerald-300 hover:bg-emerald-50"}`}>
              <span className="text-4xl mb-2 block">📄</span>
              <p className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>اضغط لرفع شهادات التخرج</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>PDF, JPG, PNG</p>
            </div>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:cursor-pointer transition-all ${darkMode ? "border-emerald-700 hover:bg-emerald-900/20" : "border-emerald-300 hover:bg-emerald-50"}`}>
              <span className="text-4xl mb-2 block">🆔</span>
              <p className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>اضغط لرفع صورة الهوية</p>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>الوجهتان الأمامية والخلفية</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>معلومات الحساب البنكي</h3>
            <input 
              type="text" 
              placeholder="اسم صاحب الحساب" 
              value={providerData.accountHolder}
              onChange={(e) => setProviderData({...providerData, accountHolder: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600 focus:border-emerald-500"}`}
            />
            <input 
              type="text" 
              placeholder="رقم الآيبان" 
              value={providerData.iban}
              onChange={(e) => setProviderData({...providerData, iban: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500" : "bg-white border-gray-200 text-gray-800 placeholder-gray-600 focus:border-emerald-500"}`}
            />
            <select 
              value={providerData.bank}
              onChange={(e) => setProviderData({...providerData, bank: e.target.value})}
              className={`w-full p-4 border-2 rounded-xl focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-teal-500" : "bg-white border-gray-200 text-gray-800 focus:border-emerald-500"}`}
            >
              <option>البنك</option>
              <option>البنك المركزي العراقي</option>
              <option>بنك الرافدين</option>
              <option>بنك الرشيد</option>
              <option>بنك بغداد</option>
              <option>بنك الأهلية العراقي</option>
              <option>بنك الموصل</option>
              <option>بنك الخليج التجاري</option>
              <option>بنك دار السلام</option>
              <option>بنك التجارة والاستثمار</option>
              <option>بنك الفرات الأوسط</option>
              <option>بنك تمويل التجارة والاستثمار</option>
              <option>بنك بيت الاستثمار العراقي</option>
              <option>بنك دجلة والفرات</option>
              <option>بنك الاقتصاد الإسلامي</option>
              <option>بنك الإنماء الإسلامي</option>
              <option>المصرف العراقي للتجارة</option>
              <option>الصنعة والسياحة</option>
              <option>بنك الاستثمار العراقي</option>
              <option>بنك آشور الإسلامي</option>
              <option>غيرها</option>
            </select>

            {/* PIN Section */}
            <div className={`pt-4 border-t-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h4 className={`text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>🔐 إنشاء رقم سري للدخول</h4>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-3`}>ستستخدم هذا الرقم السري لتسجيل الدخول مستقبلاً</p>
              <input 
                type="password" 
                placeholder="أدخل رقم سري (4-6 أرقام)" 
                value={providerData.pin}
                onChange={(e) => setProviderData({...providerData, pin: e.target.value})}
                maxLength={6}
                className={`w-full p-4 border-2 rounded-xl focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500" : "bg-blue-50 border-blue-200 text-gray-800 placeholder-gray-600 focus:border-blue-500"}`}
              />
              <input 
                type="password" 
                placeholder="تأكيد الرقم السري" 
                maxLength={6}
                className={`w-full p-4 border-2 rounded-xl focus:outline-none mt-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500" : "bg-blue-50 border-blue-200 text-gray-800 placeholder-gray-600 focus:border-blue-500"}`}
              />
            </div>

            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${darkMode ? "bg-gray-800 border-gray-700 hover:border-emerald-600" : "bg-white border-gray-200 hover:border-emerald-200"}`}>
              <input 
                type="checkbox" 
                checked={providerData.termsAccepted}
                onChange={(e) => setProviderData({...providerData, termsAccepted: e.target.checked})}
                className="w-5 h-5 text-emerald-600 rounded" 
              />
              <span className={darkMode ? "text-gray-200" : "text-gray-700"}>أوافق على الشروط والأحكام</span>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${darkMode ? "bg-rose-900/20 border-rose-700/50 hover:border-rose-600/70" : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 hover:border-rose-400"}`}>
              <input 
                type="checkbox" 
                checked={providerData.privacyAccepted}
                onChange={(e) => setProviderData({...providerData, privacyAccepted: e.target.checked})}
                className="w-5 h-5 text-rose-600 rounded" 
              />
              <div className="flex-1">
                <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>أوافق على سياسة الخصوصية 🔒</span>
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>تعهد منك بالالتزام بحماية بيانات المرضى والسرية الطبية</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* ===== Action Buttons ===== */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-6 ${darkMode ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"} backdrop-blur-md`}>
        <div className="flex gap-3">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            السابق
          </button>
          <button
            onClick={() => {
              if (step < 5) {
                // Check if step 3 (services) is completed before proceeding
                if (step === 3 && providerData.services.length === 0) {
                  alert("يجب اختيار خدمة واحدة على الأقل قبل المتابعة");
                  return;
                }
                setStep(step + 1);
              } else {
                // Check if privacy policy is accepted before registration
                if (!providerData.privacyAccepted) {
                  alert("يجب الموافقة على سياسة الخصوصية لإتمام التسجيل");
                  return;
                }
                
                // Save provider data to localStorage on registration completion
                if (providerData.pin && providerData.pin.trim()) {
                  // Generate a simple provider ID based on timestamp
                  const newProviderId = Math.floor(Math.random() * 10000) + 100;
                  
                  // Determine provider type from the type parameter
                  const typeMap: any = {
                    "1": "طبيب",
                    "2": "ممرض",
                    "3": "معالج فيزيائي",
                    "4": "فني مختبر"
                  };
                  
                  const authData = {
                    isLoggedIn: true,
                    firstName: providerData.firstName,
                    lastName: providerData.lastName,
                    email: providerData.email,
                    phone: providerData.phone,
                    region: providerData.region,
                    neighborhood: providerData.neighborhood,
                    providerType: typeMap[providerType] || "متخصص",
                    icon: provider.icon,
                    specialization: providerData.clinicName || typeMap[providerType],
                    license: providerData.license,
                    bio: providerData.bio,
                    services: providerData.services,
                    providerId: newProviderId,
                    loginTime: new Date().toISOString()
                  };
                  
                  localStorage.setItem("providerAuth", JSON.stringify(authData));
                  
                  setProviderAuth(authData);
                  setRegistrationComplete(true);
                  
                  // Redirect to booking page after 1 second (except for nurses)
                  setTimeout(() => {
                    if (providerType !== "2") {
                      router.push("/booking");
                    }
                  }, 1000);
                } else {
                  alert("يرجى إدخال الرقم السري في الخطوة الأخيرة");
                }
              }
            }}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            {step === 5 ? "إنهاء التسجيل" : "التالي"}
          </button>
        </div>
      </div>
        </>
      )}

      {/* ===== Chat Modal Overlay ===== */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"></div>
      )}

      {/* ===== Chat Window ===== */}
      {chatOpen && (
        <div className={`fixed bottom-0 right-0 z-50 w-full sm:w-96 h-96 sm:h-screen shadow-2xl rounded-t-3xl sm:rounded-none flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-5 flex items-center justify-between rounded-t-3xl sm:rounded-none">
            <button
              onClick={() => setChatOpen(false)}
              className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold">{selectedRequest?.patientName} 👤</h3>
              <p className="text-xs text-white/80">متصل الآن</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all">
                <span className="text-xl">📞</span>
              </button>
              <button className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all">
                <span className="text-xl">📹</span>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? "bg-gradient-to-b from-gray-700 to-gray-800" : "bg-gradient-to-b from-emerald-50 to-white"}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "provider" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === "provider"
                      ? darkMode ? "bg-gray-600 text-gray-100 rounded-bl-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "provider" ? darkMode ? "text-gray-300" : "text-gray-600" : "text-white/70"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className={`border-t p-4 flex gap-3 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="اكتب رسالتك..."
              className={`flex-1 px-4 py-3 border-2 rounded-2xl focus:outline-none text-right ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-teal-500" : "border-gray-200 bg-white text-gray-800 placeholder-gray-600 focus:border-emerald-500"}`}
            />
            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-3 hover:shadow-lg transition-all active:scale-95"
            >
              <span className="text-xl">📤</span>
            </button>
          </div>
        </div>
      )}
      </>
      )}

      {/* Provider Bottom Navigation */}
      {providerAuth?.isLoggedIn && <ProviderBottomNav language={language} />}
    </div>
  );
}
