'use client'

import Link from 'next/link'

export default function AdminPage() {
  const menuItems = [
    {
      title: 'لوحة التحكم',
      description: 'عرض الإحصائيات والمؤشرات الرئيسية',
      href: '/dashboard',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'المرضى',
      description: 'إدارة بيانات وملفات المرضى',
      href: '/patients',
      icon: '👥',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'الخدمات',
      description: 'إدارة فهرس الخدمات والأسعار',
      href: '/services',
      icon: '🏥',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'الطلبات',
      description: 'متابعة وإدارة طلبات الخدمة',
      href: '/orders',
      icon: '📋',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'مقدمو الخدمة',
      description: 'إدارة الممرضات والمعالجين والفنيين',
      href: '/providers',
      icon: '👨‍⚕️',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'المعاملات المالية',
      description: 'تتبع الدفعات والإيرادات',
      href: '/transactions',
      icon: '💳',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'اختبار الاتصال',
      description: 'اختبر اتصال التطبيق مع قاعدة البيانات',
      href: '/test-connection',
      icon: '🔌',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'السياسات الأمانية',
      description: 'تفعيل وإدارة سياسات الأمان (RLS)',
      href: '/admin/rls',
      icon: '🔐',
      color: 'from-red-500 to-red-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">لوحة الإدارة</h1>
          <p className="text-blue-100">نظام إدارة صحي متكامل</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 pb-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">الفئات المتاحة</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{menuItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">الحالة</p>
            <p className="text-3xl font-bold text-green-600 mt-2">جاهز</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">قاعدة البيانات</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">Supabase</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">الإصدار</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">1.0.0</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="h-full bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer overflow-hidden">
                {/* Header Bar */}
                <div className={`bg-gradient-to-r ${item.color} h-32 flex items-center justify-center text-white`}>
                  <span className="text-6xl">{item.icon}</span>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-4 text-blue-600 font-semibold flex items-center">
                    اذهب إلى
                    <span className="ml-2">←</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white p-8 rounded shadow text-center">
          <h3 className="text-xl font-bold mb-4">الحصول على الدعم</h3>
          <p className="text-gray-600 mb-4">
            إذا واجهت أي مشكلة أو لديك أسئلة، يرجى التواصل معنا
          </p>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
              العودة للصفحة الرئيسية
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
