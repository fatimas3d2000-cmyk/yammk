"use client";

import { useState } from "react";

interface SeedUser {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  user_type: "patient" | "provider";
  profile_picture?: string;
}

const DEFAULT_USERS: SeedUser[] = [
  {
    full_name: "د. محمد أحمد السعيد",
    email: "doctor@example.com",
    phone: "0501234567",
    password: "Doctor@123",
    user_type: "provider",
  },
  {
    full_name: "أحمد محمد علي",
    email: "patient1@example.com",
    phone: "0502345678",
    password: "Patient@123",
    user_type: "patient",
  },
  {
    full_name: "فاطمة الزهراء محمود",
    email: "patient2@example.com",
    phone: "0503456789",
    password: "Patient@123",
    user_type: "patient",
  },
];

export default function SeedUsersPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [detailedLogs, setDetailedLogs] = useState<string[]>([]);

  const checkSchema = async () => {
    if (!adminKey) {
      setMessage("⚠️ أدخل مفتاح الإدارة أولاً");
      return;
    }

    setLoading(true);
    setMessage("⏳ جاري فحص بنية الجدول...");
    setDetailedLogs([]);

    try {
      const response = await fetch("/api/admin/check-schema", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminKey}`,
        },
      });

      const data = await response.json();
      
      if (data.structure && data.structure.length > 0) {
        setMessage(`✅ بنية الجدول: ${data.structure.join(", ")}`);
        setDetailedLogs([`الأعمدة المتاحة: ${data.structure.join(", ")}`]);
      } else {
        setMessage("⚠️ جدول patients فارغ أو لا يحتوي على بيانات");
        if (data.details) {
          setDetailedLogs([`تفاصيل: ${data.details}`, `الرسالة: ${data.message}`]);
        }
      }
    } catch (error) {
      setMessage("❌ خطأ في الاتصال");
      setDetailedLogs([error instanceof Error ? error.message : String(error)]);
    } finally {
      setLoading(false);
    }
  };

  const seedAllUsers = async () => {
    if (!adminKey) {
      setMessage("⚠️ أدخل مفتاح الإدارة أولاً");
      return;
    }

    setLoading(true);
    setMessage("⏳ جاري إضافة المستخدمين...");
    setResults([]);
    setDetailedLogs([]);

    const logs: string[] = [];

    try {
      const newResults = [];

      for (const user of DEFAULT_USERS) {
        logs.push(`⏳ جاري إضافة ${user.full_name}...`);
        
        try {
          const response = await fetch("/api/admin/seed-users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminKey}`,
            },
            body: JSON.stringify(user),
          });

          const data = await response.json();

          newResults.push({
            email: user.email,
            success: response.ok,
            message: data.message || data.error,
            details: data.details || data.hint || "",
          });

          if (response.ok) {
            logs.push(`✅ تم إضافة ${user.email}`);
          } else {
            logs.push(`❌ خطأ في ${user.email}: ${data.error}`);
            if (data.details) {
              logs.push(`   التفاصيل: ${data.details}`);
            }
            if (data.hint) {
              logs.push(`   التلميح: ${data.hint}`);
            }
          }
        } catch (error) {
          newResults.push({
            email: user.email,
            success: false,
            message: error instanceof Error ? error.message : "خطأ غير معروف",
            details: "",
          });
          logs.push(`❌ خطأ في الاتصال مع ${user.email}`);
        }
      }

      setResults(newResults);
      setDetailedLogs(logs);
      const successCount = newResults.filter((r) => r.success).length;
      setMessage(`✅ تم إضافة ${successCount} من ${DEFAULT_USERS.length} مستخدم`);
    } catch (error) {
      setMessage("❌ حدث خطأ: " + (error instanceof Error ? error.message : "خطأ غير معروف"));
      setDetailedLogs([error instanceof Error ? error.message : String(error)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", direction: "rtl" }}>
      <h1>🌱 إضافة مستخدمين تجريبيين</h1>

      {/* Admin Key Input */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
          مفتاح الإدارة (ADMIN_SEED_KEY):
        </label>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="أدخل مفتاح الإدارة من .env.local"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={checkSchema}
          disabled={loading || !adminKey}
          style={{
            padding: "10px 15px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || !adminKey ? 0.6 : 1,
            marginRight: "10px",
          }}
        >
          🔍 فحص بنية الجدول
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "4px",
            backgroundColor: message.includes("❌") ? "#ffe6e6" : "#e6ffe6",
            color: message.includes("❌") ? "#d32f2f" : "#2e7d32",
            border: `1px solid ${message.includes("❌") ? "#ef5350" : "#66bb6a"}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Detailed Logs */}
      {detailedLogs.length > 0 && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            border: "1px solid #ddd",
            maxHeight: "300px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {detailedLogs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      )}

      {/* Seed All Button */}
      <button
        onClick={seedAllUsers}
        disabled={loading || !adminKey}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading || !adminKey ? 0.6 : 1,
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        {loading ? "⏳ جاري الإضافة..." : "➕ إضافة جميع المستخدمين"}
      </button>

      {/* Results Table */}
      {results.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #ddd" }}>
                البريد الإلكتروني
              </th>
              <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #ddd" }}>
                الحالة
              </th>
              <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #ddd" }}>
                الرسالة
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{result.email}</td>
                <td style={{ padding: "10px" }}>
                  {result.success ? "✅ نجح" : "❌ فشل"}
                </td>
                <td style={{ padding: "10px", fontSize: "12px", color: "#666" }}>
                  {result.message}
                  {result.details && <div style={{ color: "#d32f2f" }}>التفاصيل: {result.details}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Instructions */}
      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
        <h3>📖 الخطوات:</h3>
        <ol style={{ direction: "rtl" }}>
          <li>أدخل مفتاح الإدارة من <code>.env.local</code></li>
          <li>اضغط "🔍 فحص بنية الجدول" للتحقق من الأعمدة الموجودة</li>
          <li>إذا كان الفحص ناجحاً، اضغط "➕ إضافة جميع المستخدمين"</li>
          <li>اطّلع على السجلات التفصيلية لمعرفة ما حدث</li>
        </ol>
      </div>
    </div>
  );
}
