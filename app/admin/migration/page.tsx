"use client";

import { useState } from "react";

export default function MigrationPage() {
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const sqlMigration = `-- Add missing columns to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'patient';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS experience INTEGER;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Copy name to full_name
UPDATE patients SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlMigration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runMigration = async () => {
    if (!adminKey) {
      setMessage("⚠️ أدخل مفتاح الإدارة");
      return;
    }

    setLoading(true);
    setMessage("⏳ جاري تنفيذ الـ migration...");

    try {
      const response = await fetch("/api/admin/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ تم تنفيذ الـ migration بنجاح! الآن يمكنك إضافة المستخدمين.");
      } else {
        setMessage(`❌ خطأ: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ خطأ: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", direction: "rtl" }}>
      <h1>🗂️ إضافة الأعمدة المفقودة</h1>

      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
        <h2 style={{ marginTop: 0 }}>⚠️ مشكلة مكتشفة</h2>
        <p>جدول <code style={{ fontSize: "14px", backgroundColor: "#fff" }}>patients</code> لا يحتوي على جميع الأعمدة المطلوبة.</p>
        <p>الأعمدة المفقودة:</p>
        <ul>
          <li><code>password</code></li>
          <li><code>is_active</code></li>
          <li><code>user_type</code></li>
          <li><code>profile_picture</code></li>
          <li><code>bio</code></li>
          <li><code>specialization</code></li>
          <li><code>experience</code></li>
          <li><code>rating</code></li>
          <li><code>full_name</code></li>
        </ul>
      </div>

      <h2>📋 الخيارات:</h2>

      {/* Option 1: Manual SQL */}
      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#e7f3ff", borderRadius: "8px", border: "1px solid #2196F3" }}>
        <h3>الخيار 1️⃣: تنفيذ يدوي في Supabase Dashboard</h3>
        <ol>
          <li>اذهب إلى <a href="https://app.supabase.com" target="_blank" rel="noopener">Supabase Dashboard</a></li>
          <li>اختر المشروع: <code>okoqnrmyhlgamoiuiuiz</code></li>
          <li>افتح <strong>SQL Editor</strong> من القائمة اليمنية</li>
          <li>نسخ الـ SQL التالي واللصقه:</li>
        </ol>

        <div style={{
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          padding: "15px",
          borderRadius: "4px",
          overflow: "auto",
          marginBottom: "10px",
          fontFamily: "monospace",
          fontSize: "12px",
          maxHeight: "300px",
        }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{sqlMigration}</pre>
        </div>

        <button
          onClick={copySql}
          style={{
            padding: "10px 15px",
            backgroundColor: copied ? "#4caf50" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {copied ? "✅ تم النسخ" : "📋 نسخ الـ SQL"}
        </button>

        <ol start={5}>
          <li>اضغط على <strong>Execute</strong></li>
          <li>تم! 🎉</li>
        </ol>
      </div>

      {/* Option 2: Automatic (if working) */}
      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f0f4f8", borderRadius: "8px", border: "1px solid #ccc" }}>
        <h3>الخيار 2️⃣: تنفيذ تلقائي (تجريبي)</h3>
        <p>إذا كان لديك مفتاح الإدارة، يمكن محاولة التنفيذ التلقائي:</p>
        
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="أدخل مفتاح الإدارة (ADMIN_SEED_KEY)"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        />

        <button
          onClick={runMigration}
          disabled={loading || !adminKey}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || !adminKey ? 0.6 : 1,
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {loading ? "⏳ جاري التنفيذ..." : "▶️ تنفيذ الـ Migration"}
        </button>

        {message && (
          <div style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: message.includes("❌") ? "#ffe6e6" : "#e6ffe6",
            color: message.includes("❌") ? "#d32f2f" : "#2e7d32",
            borderRadius: "4px",
            border: `1px solid ${message.includes("❌") ? "#ef5350" : "#66bb6a"}`,
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div style={{ padding: "20px", backgroundColor: "#e8f5e9", borderRadius: "8px", border: "1px solid #4caf50" }}>
        <h3>📝 الخطوات التالية:</h3>
        <ol>
          <li>بعد إضافة الأعمدة، اذهب إلى <a href="/admin/seed-users">/admin/seed-users</a></li>
          <li>أدخل مفتاح الإدارة</li>
          <li>اضغط على "🔍 فحص بنية الجدول" للتحقق</li>
          <li>إذا نجح، اضغط على "➕ إضافة جميع المستخدمين"</li>
          <li>الآن يمكنك استخدام التطبيق بشكل طبيعي!</li>
        </ol>
      </div>
    </div>
  );
}
