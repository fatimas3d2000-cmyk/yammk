"use client";

import { Cairo } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { t } from "@/lib/translations";
import Navbar from "@/components/Navbar";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function PatientSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("يرجى ملء جميع الحقول");
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("يرجى إدخال ريد إلكتروني صحيح");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        setLoading(false);
        return;
      }

      // Simulate signup - in production, call your backend API
      const patientData = {
        isLoggedIn: true,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        loginType: "email",
        signupTime: new Date().toISOString(),
      };

      localStorage.setItem("patientAuth", JSON.stringify(patientData));
      // Clear provider auth when patient logs in
      localStorage.removeItem("providerAuth");
      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء محاولة إنشاء الحساب");
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      // In production, implement Google OAuth flow
      const googleUser = {
        isLoggedIn: true,
        email: "patient@gmail.com",
        fullName: "Google User",
        loginType: "google",
        signupTime: new Date().toISOString(),
      };

      localStorage.setItem("patientAuth", JSON.stringify(googleUser));
      // Clear provider auth when patient logs in
      localStorage.removeItem("providerAuth");
      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setError("فشل إنشاء الحساب مع Google");
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black" : "bg-gradient-to-b from-blue-50 via-cyan-50 to-white"} ${cairo.className}`}
    >
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        language="ar"
        providerAuth={null}
        onMenuClick={() => {}}
        onNotificationClick={() => {}}
      />

      {/* Main Content */}
      <div className="mt-[70px] min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg">
                <span className="text-4xl">🩺</span>
              </div>
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              إنشاء حساب جديد
            </h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              انضم إلى أفضل منصة للخدمات الصحية
            </p>
          </div>

          {/* Signup Card */}
          <div className={`rounded-3xl p-6 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="محمد أحمد"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  disabled={loading}
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+966 5xx xxx xxxx"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={loading}
                />
                أوافق على الشروط والأحكام
              </label>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                <div className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
              </div>
              <div className={`relative flex justify-center text-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <span className={darkMode ? "px-2 text-gray-400" : "px-2 text-gray-600"}>أو</span>
              </div>
            </div>

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
            >
              <Image
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
                alt="Google"
                width={20}
                height={20}
              />
              إنشاء حساب مع Google
            </button>

            {/* Login Link */}
            <p className={`text-center text-sm mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              هل لديك حساب بالفعل؟{" "}
              <button
                onClick={() => router.push("/patient-login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                تسجيل الدخول
              </button>
            </p>
          </div>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className={`text-sm hover:underline ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"}`}
              disabled={loading}
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
