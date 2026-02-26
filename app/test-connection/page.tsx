'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TestResult {
  name: string
  status: string
  message: string
  success: boolean
}

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const results: TestResult[] = []

    // Test 1: Supabase Connection
    try {
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      if (data.success) {
        results.push({
          name: 'اتصال Supabase',
          status: 'نجح',
          message: 'تم الاتصال بنجاح',
          success: true,
        })
      } else {
        results.push({
          name: 'اتصال Supabase',
          status: 'فشل',
          message: data.error || 'لم يتم الاتصال',
          success: false,
        })
      }
    } catch (error) {
      results.push({
        name: 'اتصال Supabase',
        status: 'خطأ',
        message: (error as Error).message || 'خطأ غير معروف',
        success: false,
      })
    }

    // Test 2: Patients Table
    try {
      const { getPatients } = await import('@/lib/database')
      const { data, error } = await getPatients()
      if (!error) {
        results.push({
          name: 'جدول المرضى',
          status: 'نجح',
          message: `وجدنا ${data?.length || 0} مريض`,
          success: true,
        })
      } else {
        results.push({
          name: 'جدول المرضى',
          status: 'خطأ',
          message: (error as Error).message || 'خطأ غير معروف',
          success: false,
        })
      }
    } catch (error) {
      results.push({
        name: 'جدول المرضى',
        status: 'خطأ',
        message: (error as Error).message || 'خطأ غير معروف',
        success: false,
      })
    }

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">اختبار الاتصال</h1>

        <div className="bg-white p-6 rounded shadow mb-8">
          <p className="text-gray-600 mb-4">
            اختبر اتصال التطبيق مع قاعدة البيانات والخدمات
          </p>
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded font-bold"
          >
            {loading ? 'جاري الاختبار...' : 'بدء الاختبار'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded border-l-4 ${
                  result.success
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{result.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{result.message}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                    result.success
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded border-l-4 border-blue-500 mt-8">
          <h2 className="font-bold text-lg mb-4">الخطوات التالية</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ اختبر الاتصال بنجاح</li>
            <li>📊 اذهب إلى <Link href="/dashboard" className="text-blue-500 hover:underline">لوحة التحكم</Link></li>
            <li>👥 أدر <Link href="/patients" className="text-blue-500 hover:underline">المرضى</Link></li>
            <li>🏥 أدر <Link href="/services" className="text-blue-500 hover:underline">الخدمات</Link></li>
            <li>📋 أدر <Link href="/orders" className="text-blue-500 hover:underline">الطلبات</Link></li>
            <li>👨‍⚕️ أدر <Link href="/providers" className="text-blue-500 hover:underline">مقدمي الخدمة</Link></li>
            <li>💳 أدر <Link href="/transactions" className="text-blue-500 hover:underline">المعاملات المالية</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
