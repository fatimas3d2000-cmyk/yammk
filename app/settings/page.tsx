"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import PatientBottomNav from "@/components/PatientBottomNav";
import { pickImage, saveImageToStorage, getImageFromStorage, getUserImageKey } from "@/lib/imageUtils";
import { 
  signInWithGoogle, 
  saveLinkGoogleAccount, 
  getLinkedGoogleAccount,
  unlinkGoogleAccount,
  type GoogleSignInResult 
} from "@/lib/googleAuth"; // Only used for patients, not for providers

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [userType, setUserType] = useState<"provider" | "patient">("patient");
  const [providerAuth, setProviderAuth] = useState<any>(null);
  const [patientAuth, setPatientAuth] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [linkedGoogleAccount, setLinkedGoogleAccount] = useState<GoogleSignInResult | null>(null);
  const [editedData, setEditedData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    clinicName: "",
    license: "",
    identityNumber: "",
    fullName: "",
    linkedAccount: ""
  });

  // Check if user is provider or patient
  useEffect(() => {
    const providerAuthData = localStorage.getItem("providerAuth");
    const patientAuthData = localStorage.getItem("patientAuth");

    if (patientAuthData) {
      try {
        const parsedPatientAuth = JSON.parse(patientAuthData);
        setPatientAuth(parsedPatientAuth);
        setUserType("patient");
        setEditedData({
          fullName: parsedPatientAuth.fullName || "",
          email: parsedPatientAuth.email || "",
          phone: parsedPatientAuth.phone || "",
          linkedAccount: parsedPatientAuth.loginType === "google" ? "Google" : ("Email" || ""),
          firstName: parsedPatientAuth.fullName?.split(" ")[0] || "",
          lastName: parsedPatientAuth.fullName?.split(" ")[1] || "",
          bio: "",
          clinicName: "",
          license: "",
          identityNumber: ""
        });
      } catch (e) {
        console.error("Error parsing patient auth:", e);
      }
    } else if (providerAuthData) {
      try {
        const parsedAuth = JSON.parse(providerAuthData);
        setProviderAuth(parsedAuth);
        setUserType("provider");
        if (parsedAuth.provider) {
          setEditedData({
            firstName: parsedAuth.provider.firstName || "",
            lastName: parsedAuth.provider.lastName || "",
            email: parsedAuth.provider.email || "",
            phone: parsedAuth.provider.phone || "",
            bio: parsedAuth.provider.bio || "",
            clinicName: parsedAuth.provider.specialization || "",
            license: parsedAuth.provider.license || "",
            identityNumber: parsedAuth.provider.identityNumber || "",
            fullName: "",
            linkedAccount: ""
          });
        }
      } catch (e) {
        console.error("Error parsing provider auth:", e);
        setUserType("patient");
      }
    }

    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Load language preference
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load profile image - unique per user
    const userImageKey = getUserImageKey();
    const savedImage = getImageFromStorage(userImageKey);
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Load linked Google account (only for patients)
    if (userType === "patient") {
      const linkedGoogle = getLinkedGoogleAccount("patient");
      if (linkedGoogle) {
        setLinkedGoogleAccount(linkedGoogle);
      }
    }
  }, []);

  // Save dark mode preference
  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem("darkMode", JSON.stringify(value));
  };

  // Save language preference
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    // Trigger storage event for other tabs/windows and current page
    window.dispatchEvent(new StorageEvent("storage", {
      key: "language",
      newValue: newLanguage
    }));
  };

  // Handle profile image upload from file input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        const userImageKey = getUserImageKey();
        localStorage.setItem(userImageKey, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile image from Camera/Gallery using Capacitor
  const handleChangeProfileImage = async () => {
    const imageData = await pickImage();
    if (imageData) {
      setProfileImage(imageData);
      saveImageToStorage(imageData); // Automatically uses getUserImageKey()
      alert("✓ تم تغيير الصورة بنجاح");
    }
  };

  // Handle Google Account Linking
  const handleLinkGoogleAccount = async () => {
    const googleResult = await signInWithGoogle();
    if (googleResult) {
      const saved = saveLinkGoogleAccount(
        googleResult,
        userType === "patient" ? "patient" : "provider"
      );
      if (saved) {
        setLinkedGoogleAccount(googleResult);
        alert(`✓ تم ربط الحساب: ${googleResult.email}`);
      } else {
        alert("❌ حدث خطأ في ربط الحساب");
      }
    }
  };

  // Handle Google Account Unlinking
  const handleUnlinkGoogleAccount = () => {
    if (confirm("هل تريد فصل حساب Google؟")) {
      const unlinked = unlinkGoogleAccount(
        userType === "patient" ? "patient" : "provider"
      );
      if (unlinked) {
        setLinkedGoogleAccount(null);
        alert("✓ تم فصل حساب Google");
      }
    }
  };

  // Handle Google Account Change (for patients)
  const handleChangeGoogleAccount = async () => {
    const googleResult = await signInWithGoogle();
    if (googleResult) {
      // Update full patient auth data with new Google account info
      const updatedPatientAuth = {
        ...patientAuth,
        isLoggedIn: true,
        email: googleResult.email,
        fullName: googleResult.name,
        picture: googleResult.picture,
        googleId: googleResult.googleId,
        loginType: "google",
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem("patientAuth", JSON.stringify(updatedPatientAuth));
      setPatientAuth(updatedPatientAuth);
      setLinkedGoogleAccount(googleResult);
      setEditedData({
        ...editedData,
        fullName: googleResult.name,
        email: googleResult.email
      });
      alert(`✓ تم تحديث الحساب إلى: ${googleResult.email}`);
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    if (userType === "provider" && providerAuth) {
      const updatedAuth = {
        ...providerAuth,
        provider: {
          ...providerAuth.provider,
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          email: editedData.email,
          phone: editedData.phone,
          bio: editedData.bio,
          specialization: editedData.clinicName,
          license: editedData.license,
          identityNumber: editedData.identityNumber
        }
      };
      localStorage.setItem("providerAuth", JSON.stringify(updatedAuth));
      setProviderAuth(updatedAuth);
    } else if (userType === "patient" && patientAuth) {
      const updatedAuth = {
        ...patientAuth,
        fullName: editedData.fullName || `${editedData.firstName} ${editedData.lastName}`,
        email: editedData.email,
        phone: editedData.phone
      };
      localStorage.setItem("patientAuth", JSON.stringify(updatedAuth));
      setPatientAuth(updatedAuth);
    }
    setIsEditingProfile(false);
    alert("تم حفظ التغييرات بنجاح ✓");
  };

  return (
    <div
      dir="rtl"
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
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">⚙️ {t("settings", language)}</h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Content ===== */}
      <div className="px-6 py-6 pb-32">
        {/* Provider Profile Section */}
        {userType === "provider" && (
          <div className={`mb-8 p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white shadow-md"} rounded-2xl border-2 border-emerald-200`}>
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>👤 ملف الحساب الشخصي</h3>
            
            {/* Profile Image Section */}
            <div className={`flex flex-col items-center gap-4 mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-emerald-400 to-teal-400"} overflow-hidden border-4 border-white shadow-lg`}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{providerAuth?.provider?.icon || "👨‍⚕️"}</span>
                )}
              </div>
              <button
                onClick={handleChangeProfileImage}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${darkMode ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                📷 تغيير الصورة
              </button>
            </div>

            {/* Profile Edit Section */}
            {isEditingProfile ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الأول"
                  value={editedData.firstName}
                  onChange={(e) => setEditedData({...editedData, firstName: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="text"
                  placeholder="اسم العائلة"
                  value={editedData.lastName}
                  onChange={(e) => setEditedData({...editedData, lastName: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={editedData.email}
                  onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="text"
                  placeholder="اسم العيادة/المركز"
                  value={editedData.clinicName}
                  onChange={(e) => setEditedData({...editedData, clinicName: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="text"
                  placeholder="رقم الهوية/الجواز"
                  value={editedData.identityNumber}
                  onChange={(e) => setEditedData({...editedData, identityNumber: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="text"
                  placeholder="رقم الشهادة/الترخيص"
                  value={editedData.license}
                  onChange={(e) => setEditedData({...editedData, license: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <textarea
                  placeholder="نبذة عن نفسك"
                  value={editedData.bio}
                  onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  rows={3}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    ✅ حفظ التغييرات
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className={`flex-1 py-3 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-xl font-bold hover:opacity-80 transition-all`}
                  >
                    ❌ إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>الاسم الكامل</p>
                  <p className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {editedData.firstName} {editedData.lastName}
                  </p>
                </div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>البريد الإلكتروني</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.email}</p>
                </div>
                {editedData.license && (
                  <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>رقم الشهادة</p>
                    <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.license}</p>
                  </div>
                )}
                {editedData.identityNumber && (
                  <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>رقم الهوية</p>
                    <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.identityNumber}</p>
                  </div>
                )}
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                  ✏️ تعديل المعلومات
                </button>
              </div>
            )}
          </div>
        )}

        {/* Patient Profile Section */}
        {userType === "patient" && (
          <div className={`mb-8 p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white shadow-md"} rounded-2xl border-2 border-blue-200`}>
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>👤 ملف الحساب الشخصي</h3>
            
            {/* Profile Image Section */}
            <div className={`flex flex-col items-center gap-4 mb-6 pb-6 border-b-2 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-blue-400 to-cyan-400"} overflow-hidden border-4 border-white shadow-lg`}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🩺</span>
                )}
              </div>
              <button
                onClick={handleChangeProfileImage}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                📷 تغيير الصورة
              </button>
            </div>

            {/* Profile Edit Section */}
            {isEditingProfile ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={editedData.fullName}
                  onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={editedData.email}
                  onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:border-blue-500`}
                />
                <div className={`p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-gray-100 border-gray-300 text-gray-700"}`}>
                  <p className="text-sm font-semibold">حساب مرتبط: <span className="text-blue-500">{editedData.linkedAccount || "بدون"}</span></p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    ✅ حفظ التغييرات
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className={`flex-1 py-3 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"} rounded-xl font-bold hover:opacity-80 transition-all`}
                  >
                    ❌ إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>الاسم الكامل</p>
                  <p className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {editedData.fullName}
                  </p>
                </div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>البريد الإلكتروني</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.email}</p>
                </div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>رقم الهاتف</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.phone}</p>
                </div>
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl mb-4`}>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>حساب مرتبط</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{editedData.linkedAccount === "google" ? "🔗 Google" : "📧 البريد الإلكتروني"}</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                  ✏️ تعديل المعلومات
                </button>
              </div>
            )}
          </div>
        )}

        {/* Google Account Linking - For Patient */}
        {userType === "patient" && (
          <div className={`mb-8 p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white shadow-md"} rounded-2xl border-2 border-blue-200`}>
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>🔗 ربط حساب Google</h3>
            
            {linkedGoogleAccount ? (
              <div className="space-y-4">
                <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl`}>
                  <div className="flex items-center gap-3 mb-3">
                    {linkedGoogleAccount.picture && (
                      <img 
                        src={linkedGoogleAccount.picture} 
                        alt="Google Account" 
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>حساب مرتبط</p>
                      <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{linkedGoogleAccount.email}</p>
                    </div>
                  </div>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>الاسم: {linkedGoogleAccount.name}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleChangeGoogleAccount}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                  >
                    تسجيل بحساب آخر
                  </button>
                  <button
                    onClick={handleUnlinkGoogleAccount}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    فصل الحساب
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLinkGoogleAccount}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                🔗 تغيير حساب Google
              </button>
            )}
          </div>
        )}

        {/* Preferences */}
        <div className="mb-8">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>{t("preferences", language)}</h3>
          <div className="space-y-3">
            {/* Dark Mode Toggle */}
            <div className={`w-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-md flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-xl">🌙</span>
              <div className="flex-1 text-right mr-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("darkMode", language)}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{darkMode ? t("enabled", language) : t("disabled", language)}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => handleDarkModeToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? "bg-gray-600 border-gray-600 peer-checked:bg-teal-600" : "bg-gray-300 border-gray-300 peer-checked:bg-blue-600"}`}></div>
              </label>
            </div>

            {/* Language Selection */}
            <div className={`w-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-md flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-xl">🌍</span>
              <div className="flex-1 text-right mr-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("language", language)}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{language === "ar" ? t("arabic", language) : t("english", language)}</p>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`px-3 py-1 rounded-lg ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-blue-50 border-blue-300"} border-2 focus:outline-none`}
              >
                <option value="ar">{t("arabic", language)}</option>
                <option value="en">{t("english", language)}</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className={`w-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-md flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-xl">🔔</span>
              <div className="flex-1 text-right mr-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("notifications", language)}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{notifications ? t("active", language) : t("inactive", language)}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? "bg-gray-600 border-gray-600 peer-checked:bg-teal-600" : "bg-gray-300 border-gray-300 peer-checked:bg-blue-600"}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Settings - Only for Providers */}
        {userType === "provider" && (
          <div className="mb-8">
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>{t("accountSecurity", language)}</h3>
            <div className="space-y-3">
              <button className={`w-full p-4 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:shadow-lg"} rounded-2xl shadow-md transition-all flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <span className="text-xl">🔐</span>
                <div className="flex-1 text-right mr-4">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("changePassword", language)}</p>
                </div>
                <span className={darkMode ? "text-gray-500" : "text-gray-400"}>›</span>
              </button>
              <button className={`w-full p-4 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:shadow-lg"} rounded-2xl shadow-md transition-all flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <span className="text-xl">📧</span>
                <div className="flex-1 text-right mr-4">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("updateEmail", language)}</p>
                </div>
                <span className={darkMode ? "text-gray-500" : "text-gray-400"}>›</span>
              </button>
              <button className={`w-full p-4 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:shadow-lg"} rounded-2xl shadow-md transition-all flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <span className="text-xl">📱</span>
                <div className="flex-1 text-right mr-4">
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("updatePhone", language)}</p>
                </div>
                <span className={darkMode ? "text-gray-500" : "text-gray-400"}>›</span>
              </button>
            </div>
          </div>
        )}

        {/* Support & Help */}
        <div className="mb-8">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>{t("supportHelp", language)}</h3>
          <div className="space-y-3">
            <button className={`w-full p-4 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:shadow-lg"} rounded-2xl shadow-md transition-all flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-xl">❓</span>
              <div className="flex-1 text-right mr-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("faq", language)}</p>
              </div>
              <span className={darkMode ? "text-gray-500" : "text-gray-400"}>›</span>
            </button>
            <button className={`w-full p-4 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:shadow-lg"} rounded-2xl shadow-md transition-all flex items-center justify-between border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-xl">💬</span>
              <div className="flex-1 text-right mr-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t("contactUs", language)}</p>
              </div>
              <span className={darkMode ? "text-gray-500" : "text-gray-400"}>›</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mb-8">
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-4`}>{t("appInfo", language)}</h3>
          <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-md text-center border-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>{t("appVersion", language)}</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>1.0.0</p>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => {
            if (userType === "provider") {
              localStorage.removeItem("providerAuth");
            } else {
              localStorage.removeItem("patientAuth");
            }
            router.push("/");
          }}
          className="w-full py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">
          تسجيل الخروج 🚪
        </button>
      </div>

      {/* ===== Bottom Navigation ===== */}
      {userType === "patient" && <PatientBottomNav language={language} />}
      {userType === "provider" && <ProviderBottomNav language={language} />}
      <div className="h-20"></div>
    </div>
  );
}
