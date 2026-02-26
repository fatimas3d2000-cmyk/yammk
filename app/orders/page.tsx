'use client'

import { useEffect, useState } from 'react'
import { getServiceOrders, addServiceOrder, updateServiceOrder, deleteServiceOrder } from '@/lib/database'

interface Order {
  id: number
  patient_id: number
  provider_id?: number
  service_id?: number
  status: string
  total_amount: number
  scheduled_date: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    patient_id: '',
    provider_id: '',
    service_id: '',
    status: 'pending',
    total_amount: '',
    scheduled_date: '',
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await getServiceOrders()
    if (error) {
      setError(error.message || 'حدث خطأ')
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      await updateServiceOrder(editingId, {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
      })
    } else {
      await addServiceOrder({
        ...formData,
        total_amount: parseFloat(formData.total_amount),
      })
    }
    
    resetForm()
    fetchOrders()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد؟')) {
      await deleteServiceOrder(id)
      fetchOrders()
    }
  }

  const resetForm = () => {
    setFormData({
      patient_id: '',
      provider_id: '',
      service_id: '',
      status: 'pending',
      total_amount: '',
      scheduled_date: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (order: Order) => {
    setFormData({
      patient_id: order.patient_id.toString(),
      provider_id: (order.provider_id || '').toString(),
      service_id: (order.service_id || '').toString(),
      status: order.status,
      total_amount: order.total_amount.toString(),
      scheduled_date: order.scheduled_date,
    })
    setEditingId(order.id)
    setShowForm(true)
  }

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-200 text-yellow-800',
      confirmed: 'bg-blue-200 text-blue-800',
      completed: 'bg-green-200 text-green-800',
      cancelled: 'bg-red-200 text-red-800',
    }
    return colors[status] || 'bg-gray-200 text-gray-800'
  }

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>
  if (error) return <div className="p-8 text-red-500">خطأ: {error}</div>

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الطلبات</h1>
          <button
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? 'إغلاق' : 'طلب جديد'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل الطلب' : 'إنشاء طلب جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="معرف المريض"
                value={formData.patient_id}
                onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="معرف مقدم الخدمة"
                value={formData.provider_id}
                onChange={(e) => setFormData({...formData, provider_id: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="معرف الخدمة"
                value={formData.service_id}
                onChange={(e) => setFormData({...formData, service_id: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="المبلغ الإجمالي"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                className="border p-2 rounded"
                step="0.01"
              />
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                className="border p-2 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="border p-2 rounded"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغى</option>
              </select>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded col-span-2"
              >
                {editingId ? 'تحديث' : 'إنشاء'}
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-right">معرف</th>
                <th className="border p-3 text-right">المريض</th>
                <th className="border p-3 text-right">الحالة</th>
                <th className="border p-3 text-right">المبلغ</th>
                <th className="border p-3 text-right">التاريخ</th>
                <th className="border p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-3">{order.id}</td>
                  <td className="border p-3">{order.patient_id}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded text-sm ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-3">${order.total_amount?.toFixed(2)}</td>
                  <td className="border p-3">{new Date(order.scheduled_date).toLocaleDateString('ar-EG')}</td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleEdit(order)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm mr-2"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-8">لا توجد طلبات حالياً</div>
        )}
      </div>
    </div>
  )
}
