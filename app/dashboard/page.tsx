'use client'

import { useEffect, useState } from 'react'
import { getPatients, getServiceCatalog, getServiceOrders, getPaymentTransactions } from '@/lib/database'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    patients: 0,
    services: 0,
    orders: 0,
    transactions: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [patientsRes, servicesRes, ordersRes, transactionsRes] = await Promise.all([
        getPatients(),
        getServiceCatalog(),
        getServiceOrders(),
        getPaymentTransactions(),
      ])

      const patients = patientsRes.data || []
      const services = servicesRes.data || []
      const orders = ordersRes.data || []
      const transactions = transactionsRes.data || []

      const totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      setStats({
        patients: patients.length,
        services: services.length,
        orders: orders.length,
        transactions: transactions.length,
        totalRevenue: totalRevenue,
      })
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'حدث خطأ')
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center text-xl">جاري التحميل...</div>
  if (error) return <div className="p-8 text-red-500">خطأ: {error}</div>

  const StatCard = ({ title, value, icon, link }: { title: string; value: any; icon: string; link?: string }) => (
    <Link href={link || '#'}>
      <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer border-t-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="المرضى"
            value={stats.patients}
            icon="👥"
            link="/patients"
          />
          <StatCard
            title="الخدمات"
            value={stats.services}
            icon="🏥"
            link="/services"
          />
          <StatCard
            title="الطلبات"
            value={stats.orders}
            icon="📋"
            link="/orders"
          />
          <StatCard
            title="المعاملات"
            value={stats.transactions}
            icon="💳"
            link="/transactions"
          />
          <StatCard
            title="الإيرادات"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
          />
        </div>

        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">الميزات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/patients">
              <div className="p-4 bg-blue-50 rounded hover:bg-blue-100 transition cursor-pointer">
                <p className="font-bold text-blue-900">إدارة المرضى</p>
                <p className="text-sm text-gray-600">إضافة وتعديل وحذف بيانات المرضى</p>
              </div>
            </Link>
            <Link href="/services">
              <div className="p-4 bg-green-50 rounded hover:bg-green-100 transition cursor-pointer">
                <p className="font-bold text-green-900">إدارة الخدمات</p>
                <p className="text-sm text-gray-600">إدارة الخدمات المتاحة والأسعار</p>
              </div>
            </Link>
            <Link href="/orders">
              <div className="p-4 bg-purple-50 rounded hover:bg-purple-100 transition cursor-pointer">
                <p className="font-bold text-purple-900">إدارة الطلبات</p>
                <p className="text-sm text-gray-600">متابعة وإدارة طلبات الخدمة</p>
              </div>
            </Link>
            <Link href="/providers">
              <div className="p-4 bg-orange-50 rounded hover:bg-orange-100 transition cursor-pointer">
                <p className="font-bold text-orange-900">إدارة مقدمي الخدمة</p>
                <p className="text-sm text-gray-600">إدارة الممرضات والمعالجين والفنيين</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
