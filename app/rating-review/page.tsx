"use client";

import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { saveRatingAndNotify } from "@/lib/notifications";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RatingAndReview() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patientName, setPatientName] = useState("زائر");
  const [patientEmail, setPatientEmail] = useState("guest@example.com");

  // Get patient data from auth
  useEffect(() => {
    const patientAuth = localStorage.getItem("patientAuth");
    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      setPatientName(parsed.fullName || "مريض");
      setPatientEmail(parsed.email || "patient@example.com");
    }
  }, []);

  // Handle rating submission
  const handleSubmitRating = async () => {
    if (rating === 0 || !comment.trim()) {
      alert("الرجاء اختيار تقييم وإضافة تعليق");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Save rating and create notification
    const success = saveRatingAndNotify({
      patientName: patientName,
      patientEmail: patientEmail,
      providerName: "أحمد محمد",
      providerId: "provider_ahmed_medical",
      rating: rating,
      comment: comment,
    });

    if (success) {
      setSubmitted(true);
      
      // Stop submitting state after animation
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);

      // Redirect after success message
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      alert("حدث خطأ في الإرسال. الرجاء المحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-white ${cairo.className}`}
    >
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b-2 border-blue-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-xl">
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">التقييم والتعليقات</h1>
          <button 
            onClick={() => router.push("/")}
            className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 hover:bg-white/30 transition-all"
          >
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </header>

      {/* ===== Service Info ===== */}
      <div className="px-6 py-8">
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
          <span className="text-6xl mb-4 block">💙</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ممرض منزلي</h2>
          <p className="text-gray-600 mb-4">أحمد محمد - 20 يناير 2026</p>
          <p className="text-gray-700">شكراً لاستخدامك خدماتنا. هل أنت راضٍ عن الخدمة المقدمة؟</p>
        </div>
      </div>

      {/* ===== Rating Section ===== */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-bold text-gray-800 mb-5 text-center">كيف تقيم الخدمة؟</h3>
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-all transform hover:scale-125 active:scale-95"
            >
              <span className="text-5xl cursor-pointer">
                {star <= rating ? "⭐" : "☆"}
              </span>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-blue-600">{rating}.0 / 5.0</p>
            <p className="text-gray-600">
              {rating === 5 && "ممتاز جداً!"}
              {rating === 4 && "جيد جداً!"}
              {rating === 3 && "جيد"}
              {rating === 2 && "مقبول"}
              {rating === 1 && "يحتاج تحسين"}
            </p>
          </div>
        )}
      </div>

      {/* ===== Comment Section ===== */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">هل لديك تعليق أو ملاحظة؟</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شارك آرائك معنا..."
          className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none text-gray-700 resize-none"
          rows={5}
        ></textarea>
        <p className="text-sm text-gray-600 mt-2">{comment.length} / 500 حرف</p>
      </div>

      {/* ===== Additional Options ===== */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">هل تود:</h3>
        <div className="space-y-3">
          <label className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-200 cursor-pointer transition-all">
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
            <span className="mr-3 text-gray-700 font-semibold">إعادة حجز الخدمة مرة أخرى</span>
          </label>
          <label className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-200 cursor-pointer transition-all">
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
            <span className="mr-3 text-gray-700 font-semibold">إضافة المقدم للمفضلة</span>
          </label>
          <label className="flex items-center p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-200 cursor-pointer transition-all">
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
            <span className="mr-3 text-gray-700 font-semibold">تلقي عرض خاص من المقدم</span>
          </label>
        </div>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="px-6 py-6 pb-20">
        {submitted ? (
          <div className="text-center p-8 mb-4">
            <div className="animate-pulse mb-4">
              <span className="text-6xl block">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">تم الإرسال بنجاح!</h2>
            <p className="text-gray-600">شكراً لتقييمك. ستعود للرئيسية قريباً...</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleSubmitRating}
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-4 mb-3 rounded-2xl font-bold text-white transition-all active:scale-95 ${
                rating === 0 || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
            <button 
              onClick={() => router.push("/")}
              disabled={isSubmitting}
              className="w-full py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-all active:scale-95"
            >
              العودة للرئيسية
            </button>
          </>
        )}
      </div>

      {/* ===== Recent Reviews ===== */}
      <div className="px-6 py-6 pb-20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">آخر التقييمات</h3>
        <div className="space-y-4">
          {[
            { name: "سارة أحمد", rating: 5, text: "خدمة ممتازة وتمريض احترافي جداً", date: "18 يناير 2026" },
            { name: "محمود علي", rating: 4.5, text: "جيد جداً، لكن تأخر قليلاً في الوصول", date: "16 يناير 2026" },
            { name: "فاطمة خالد", rating: 5, text: "تمريض متميز وخدمة سريعة جداً", date: "14 يناير 2026" },
          ].map((review, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-800">{review.name}</p>
                <span className="text-sm text-yellow-500">⭐ {review.rating}</span>
              </div>
              <p className="text-gray-700 mb-2">{review.text}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
