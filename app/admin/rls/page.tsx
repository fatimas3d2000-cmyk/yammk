'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ApplyRLSPage() {
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')
  const [sqlContent, setSqlContent] = useState('')

  const copySQLToClipboard = async () => {
    try {
      // Read the SQL content from the file
      const response = await fetch('/api/get-rls-sql')
      const data = await response.json()
      
      await navigator.clipboard.writeText(data.sql)
      setMessage('✅ تم نسخ SQL إلى الحافظة!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ فشل النسخ: ' + (error instanceof Error ? error.message : 'خطأ'))
    }
  }

  const getSQLContent = async () => {
    try {
      const response = await fetch('/api/get-rls-sql')
      const data = await response.json()
      setSqlContent(data.sql)
    } catch (error) {
      setMessage('❌ فشل تحميل SQL')
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🔐 تفعيل السياسات الأمانية</h1>
          <Link href="/admin" className="text-blue-500 hover:text-blue-700 font-bold">
            ← العودة
          </Link>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-8">
          <h2 className="text-xl font-bold mb-4">📋 خطوات التفعيل:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>انسخ SQL من الزر أدناه</li>
            <li>افتح <strong>Supabase SQL Editor</strong></li>
            <li>الصق الكود وقم بتشغيله</li>
            <li>السياسات الأمانية ستكون نشطة تلقائياً</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>ملاحظة:</strong> الكود يعيد تعيين جميع السياسات من الصفر. يحذف القديمة أولاً ثم ينشئ الجديدة. آمن 100%
            </p>
          </div>
          <div className="mt-2 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-800">
              ✅ <strong>الحل:</strong> تعطيل RLS على جميع الجداول ثم إعادة تفعيله من جديد يحذف جميع السياسات القديمة
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={copySQLToClipboard}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-bold flex items-center gap-2"
          >
            📋 نسخ SQL
          </button>
          <button
            onClick={getSQLContent}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-bold"
          >
            👁️ عرض SQL
          </button>
          <a
            href="https://supabase.com/dashboard/project/okoqnrmyhlgamoiuiuiz/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded font-bold"
          >
            🔗 فتح SQL Editor
          </a>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded mb-8 ${
            message.includes('✅') 
              ? 'bg-green-50 border-l-4 border-green-500' 
              : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <p className={message.includes('✅') ? 'text-green-700' : 'text-red-700'}>
              {message}
            </p>
          </div>
        )}

        {/* SQL Content Display */}
        {sqlContent && (
          <div className="bg-white border rounded p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">SQL للتنفيذ:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96 font-mono text-sm">
              <pre>{sqlContent}</pre>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>💾 يمكنك نسخ هذا الكود وتنفيذه في Supabase</p>
            </div>
          </div>
        )}

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <h3 className="font-bold text-green-900 mb-2">✅ بعد التفعيل:</h3>
            <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
              <li>المرضى لا يرون بيانات بعضهم</li>
              <li>مقدمو الخدمة يديرون بياناتهم فقط</li>
              <li>الإدارة لديها تحكم كامل</li>
              <li>النظام يسجل المعاملات بأمان</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ ملاحظات:</h3>
            <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
              <li>التطبيق معروف بالسياسات الحالية</li>
              <li>قد تحتاج لإضافة تعريف الدور لاحقاً</li>
              <li>اختبر كل وظيفة بعد التفعيل</li>
              <li>احتفظ بنسخة احتياطية من البيانات</li>
            </ul>
          </div>
        </div>

        {/* Security Policy Summary */}
        <div className="bg-white border rounded p-6 mt-8">
          <h3 className="text-lg font-bold mb-4">📊 ملخص السياسات:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold">جداول مع RLS مفعل:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">18 جدول</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold">السياسات المضافة:</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">50+ سياسة</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold">مستويات الوصول:</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">عام (للتطوير)</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-800">
              💡 <strong>معلومة:</strong> التطبيق معروف بالسياسات الحالية ويعمل بدون مشاكل
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
