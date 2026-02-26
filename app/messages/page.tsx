"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { t } from "@/lib/translations";
import ProviderBottomNav from "@/components/ProviderBottomNav";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Messages() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [providerAuth, setProviderAuth] = useState<any>(null);
  const [patientAuth, setPatientAuth] = useState<any>(null);
  const [patientImage, setPatientImage] = useState<string | null>(null);
  const [providerImage, setProviderImage] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<any>({});
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (auth) {
      try {
        setProviderAuth(JSON.parse(auth));
      } catch (e) {
        console.error("Error parsing provider auth:", e);
      }
    }

    const patientAuthData = localStorage.getItem("patientAuth");
    if (patientAuthData) {
      try {
        setPatientAuth(JSON.parse(patientAuthData));
      } catch (e) {
        console.error("Error parsing patient auth:", e);
      }
    }

    // Load patient profile image
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setPatientImage(savedImage);
    }

    // Load provider image
    const savedProviderImage = localStorage.getItem("providerProfileImage");
    if (savedProviderImage) {
      setProviderImage(savedProviderImage);
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
      if (e.key === "profileImage" && e.newValue) {
        setPatientImage(e.newValue);
      }
      if (e.key === "providerProfileImage" && e.newValue) {
        setProviderImage(e.newValue);
      }
    });
  }, []);

  // الطلبات المقبولة فقط مع المحادثات
  const acceptedRequests = [
    {
      id: 3,
      icon: "🩹",
      service: "تغيير الضمادات",
      patientName: "سارة محمود",
      patientPhone: "0503456789",
      status: "مقبول",
      lastMessage: "شكراً لك على الخدمة",
      timestamp: "اليوم الساعة 10:30"
    }
  ];

  // الرسائل الافتراضية لكل محادثة
  const chatMessages = {
    3: [
      {
        id: 1,
        sender: "patient",
        text: "هل يمكنك القدوم اليوم؟",
        time: "09:00"
      },
      {
        id: 2,
        sender: "provider",
        text: "نعم، سأكون هناك الساعة 10:00",
        time: "09:15"
      },
      {
        id: 3,
        sender: "patient",
        text: "حسناً، في انتظارك",
        time: "09:20"
      },
      {
        id: 4,
        sender: "provider",
        text: "وصلت الآن",
        time: "10:00"
      },
      {
        id: 5,
        sender: "patient",
        text: "شكراً لك على الخدمة",
        time: "10:30"
      }
    ]
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg = {
        id: (chatMessages[selectedChat as keyof typeof chatMessages] || []).length + 1,
        sender: "provider",
        text: newMessage,
        time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      };
      
      setMessages({
        ...messages,
        [selectedChat]: [...(chatMessages[selectedChat as keyof typeof chatMessages] || []), newMsg]
      });
      
      setNewMessage("");
    }
  };

  const currentChatMessages = selectedChat 
    ? (messages[selectedChat] || chatMessages[selectedChat as keyof typeof chatMessages] || [])
    : [];

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
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            {language === "ar" ? "الدردشات" : "Messages"}
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      <div className="flex h-screen pb-32">
        {/* ===== Chat List (Left/Right based on language) ===== */}
        <div className={`w-80 border-r ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} overflow-y-auto`}>
          <div className="p-4 space-y-2">
            {acceptedRequests.length > 0 ? (
              acceptedRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedChat(request.id)}
                  className={`w-full text-right p-4 rounded-xl transition-all ${
                    selectedChat === request.id
                      ? darkMode
                        ? "bg-blue-600"
                        : "bg-blue-100"
                      : darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <h4 className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {request.patientName}
                      </h4>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {request.lastMessage}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {request.timestamp}
                      </p>
                    </div>
                    <span className="text-2xl">{request.icon}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {language === "ar" ? "لا توجد دردشات" : "No chats"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Chat Window (Right/Left based on language) ===== */}
        <div className={`flex-1 flex flex-col ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className={`border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"} p-4`}>
                {acceptedRequests.find((r) => r.id === selectedChat) && (
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-blue-200"} overflow-hidden border-2 border-white`}>
                      {patientImage ? (
                        <img src={patientImage} alt="Patient" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🩺</span>
                      )}
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {acceptedRequests.find((r) => r.id === selectedChat)?.patientName}
                      </h2>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {acceptedRequests.find((r) => r.id === selectedChat)?.service}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChatMessages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "provider" ? "justify-start" : "justify-end"} gap-2`}
                  >
                    {msg.sender === "patient" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-blue-200"} overflow-hidden border border-white`}>
                        {patientImage ? (
                          <img src={patientImage} alt="Patient" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm">🩺</span>
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-xl ${
                        msg.sender === "provider"
                          ? darkMode
                            ? "bg-blue-700 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className={`border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} p-4 flex gap-2`}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={language === "ar" ? "اكتب رسالتك..." : "Type message..."}
                  className={`flex-1 px-4 py-2 rounded-xl border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={sendMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
                >
                  {language === "ar" ? "إرسال" : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {language === "ar" ? "اختر محادثة لتبدأ" : "Select a chat to start"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      {providerAuth?.isLoggedIn && <ProviderBottomNav language={language} />}
      <div className="h-20"></div>
    </div>
  );
}
