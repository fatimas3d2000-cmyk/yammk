'use client'

import { useEffect, useState } from 'react'
import { getServiceCatalog, addService, updateService, deleteService } from '@/lib/database'

interface Service {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await getServiceCatalog()
    if (error) {
      setError(error.message || 'حدث خطأ')
    } else {
      setServices(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      await updateService(editingId, { ...formData, price: parseFloat(formData.price) })
    } else {
      await addService({ ...formData, price: parseFloat(formData.price) })
    }
    
    resetForm()
    fetchServices()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد؟')) {
      await deleteService(id)
      fetchServices()
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (service: Service) => {
    setFormData({
      ...service,
      price: service.price.toString()
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>
  if (error) return <div className="p-8 text-red-500">خطأ: {error}</div>

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الخدمات</h1>
          <button
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? 'إغلاق' : 'إضافة خدمة جديدة'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم الخدمة"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border p-2 rounded col-span-2"
                required
              />
              <textarea
                placeholder="الوصف"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border p-2 rounded col-span-2"
                rows={3}
              />
              <input
                type="number"
                placeholder="السعر"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="border p-2 rounded"
                step="0.01"
              />
              <input
                type="text"
                placeholder="الفئة"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded col-span-2"
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{service.name}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <p className="font-bold text-blue-600 mt-2">${service.price}</p>
              <p className="text-sm text-gray-500">{service.category}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center text-gray-500 py-8">لا توجد خدمات حالياً</div>
        )}
      </div>
    </div>
  )
}
