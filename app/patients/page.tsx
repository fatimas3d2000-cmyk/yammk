'use client'

import { useEffect, useState } from 'react'

interface Patient {
  id: string
  full_name: string
  email: string
  phone: string
  user_type: string
  is_active: boolean
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adminKey, setAdminKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(true)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'patient',
  })

  useEffect(() => {
    if (adminKey) {
      fetchPatients()
    }
  }, [adminKey])

  const fetchPatients = async () => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/seed-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      })
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات')
      }
      
      const data = await response.json()
      setPatients(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!adminKey) {
      setError('مفتاح الإدارة مطلوب')
      return
    }

    if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
      setError('جميع الحقول مطلوبة')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/seed-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في إضافة المستخدم')
      }
      
      resetForm()
      fetchPatients()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ full_name: '', email: '', phone: '', password: '', user_type: 'patient' })
    setEditingId(null)
    setShowForm(false)
  }

  if (showKeyInput && !adminKey) {
    return (
      <div className="p-8 max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4 text-right">🔑 أدخل مفتاح الإدارة</h1>
        <div className="bg-gray-100 p-6 rounded">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="ADMIN_SEED_KEY من .env.local"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={() => {
              if (adminKey) setShowKeyInput(false)
              else alert('أدخل المفتاح أولاً')
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            تأكيد
          </button>
          <small className="block text-gray-600 mt-2 text-right">
            ℹ️ المفتاح في ملف .env.local (ADMIN_SEED_KEY)
          </small>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="p-8 text-center">
      <div className="inline-block">⏳ جاري التحميل...</div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-right">المرضى والمزودين</h1>
          <div>
            <button
              onClick={() => setAdminKey('')}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              تغيير المفتاح
            </button>
            <button
              onClick={() => { setShowForm(!showForm); resetForm() }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showForm ? 'إغلاق' : '➕ إضافة مستخدم جديد'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-8">
            <h2 className="text-xl font-bold mb-4 text-right">
              {editingId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <select
                value={formData.user_type}
                onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="patient">مريض</option>
                <option value="provider">مزود خدمة</option>
              </select>
              
              <div className="col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  {editingId ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {patients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">لا توجد مستخدمين حالياً</p>
            <p className="text-sm">اضغط على "إضافة مستخدم جديد" لإضافة واحد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="text-right">
                  <th className="border border-gray-300 p-3">الاسم</th>
                  <th className="border border-gray-300 p-3">البريد الإلكتروني</th>
                  <th className="border border-gray-300 p-3">الهاتف</th>
                  <th className="border border-gray-300 p-3">النوع</th>
                  <th className="border border-gray-300 p-3">الحالة</th>
                  <th className="border border-gray-300 p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">{patient.full_name}</td>
                    <td className="border border-gray-300 p-3">{patient.email}</td>
                    <td className="border border-gray-300 p-3">{patient.phone}</td>
                    <td className="border border-gray-300 p-3">
                      {patient.user_type === 'provider' ? '🏥 مزود' : '👨‍🔬 مريض'}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {patient.is_active ? '✅ نشط' : '❌ غير نشط'}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-2">
                        تعديل
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
