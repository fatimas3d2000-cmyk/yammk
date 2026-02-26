"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function ProviderLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sample registered providers with phone numbers
  const registeredProviders = [
    {
      id: 1,
      firstName: "محمد",
      lastName: "أحمد",
      email: "doctor@example.com",
      phone: "0501234567",
      type: "طبيب",
      icon: "👨‍⚕️",
      specialization: "طبيب عام",
      license: "LIC001",
      bio: "طبيب متخصص في الرعاية الأولية"
    },
    {
      id: 2,
      firstName: "فاطمة",
      lastName: "علي",
      email: "nurse@example.com",
      phone: "0502345678",
      type: "ممرضة",
      icon: "👩‍⚕️",
      specialization: "ممرضة",
      license: "LIC002",
      bio: "ممرضة متخصصة في التمريض المنزلي"
    },
    {
      id: 3,
      firstName: "علي",
      lastName: "محمود",
      email: "therapist@example.com",
      phone: "0503456789",
      type: "معالج فيزيائي",
      icon: "🏃‍♂️",
      specialization: "معالج فيزيائي",
      license: "LIC003",
      bio: "معالج متخصص في العلاج الطبيعي"
    }
  ];

  const handleLogin = async () => {
    setError("");
    
    // Validation
    if (loginMethod === "email") {
      if (!email.trim()) {
        setError("يرجى إدخال البريد الإلكتروني");
        return;
      }
    } else {
      if (!phone.trim()) {
        setError("يرجى إدخال رقم الهاتف");
        return;
      }
      if (phone.length < 10) {
        setError("رقم الهاتف يجب أن يكون 10 أرقام على الأقل");
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      let provider;
      
      if (loginMethod === "email") {
        provider = registeredProviders.find(p => p.email === email);
      } else {
        provider = registeredProviders.find(p => p.phone === phone);
      }

      if (provider) {
        // Save to localStorage
        localStorage.setItem("providerAuth", JSON.stringify({
          isLoggedIn: true,
          provider: {
            id: provider.id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            phone: provider.phone,
            type: provider.type,
            icon: provider.icon,
            specialization: provider.specialization,
            license: provider.license,
            bio: provider.bio,
            loginTime: new Date().toISOString()
          }
        }));

        // Redirect to provider dashboard with login flag
        router.push("/provider-registration?type=" + (provider.id) + "&login=true");
      } else {
        setError(loginMethod === "email" ? "البريد الإلكتروني غير موجود" : "رقم الهاتف غير موجود");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b-2 border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-xl">
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">تسجيل الدخول</h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <div className="px-6 py-8 pb-32">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-white p-2 mb-4 shadow-lg">
            <Image
              src="/ggg (1).jpg"
              alt="شعار يمك العافية"
              width={100}
              height={100}
              className="rounded-xl"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">مقدم يمك العافية</h2>
          <p className="text-gray-600">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* Login Method Tabs */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => {
              setLoginMethod("email");
              setPhone("");
              setError("");
            }}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all ${
              loginMethod === "email"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            📧 البريد الإلكتروني
          </button>
          <button
            onClick={() => {
              setLoginMethod("phone");
              setEmail("");
              setError("");
            }}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all ${
              loginMethod === "phone"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            📱 رقم الهاتف
          </button>
        </div>

        {/* Login Form */}
        <div className="space-y-4 mb-6">
          {/* Email Input */}
          {loginMethod === "email" && (
            <div>
              <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* Phone Input */}
          {loginMethod === "phone" && (
            <div>
              <label className="block text-gray-700 font-bold mb-2">📱 رقم الهاتف</label>
              <input
                type="tel"
                placeholder="أدخل رقم الهاتف (0501234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold text-center">
              {error}
            </div>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-600">أو</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Demo Credentials */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-gray-800 mb-4">🔗 بيانات تجريبية للاختبار</h4>

          {registeredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => {
                if (loginMethod === "email") {
                  setEmail(provider.email);
                } else {
                  setPhone(provider.phone);
                }
              }}
              className="p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-300 cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{provider.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    {provider.firstName} {provider.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{provider.type}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {loginMethod === "email" ? `📧 ${provider.email}` : `📱 ${provider.phone}`}
                  </p>
                </div>
                <span className="text-xl group-hover:scale-110 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-gray-700">
            ليس لديك حساب؟
            <button
              onClick={() => router.push("/therd-page")}
              className="text-blue-600 font-bold hover:underline mr-2"
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
