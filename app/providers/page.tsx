'use client'

import { useEffect, useState } from 'react'
import { getNurses, addNurse, updateNurse, deleteNurse, getLabTechnicians, addLabTechnician, updateLabTechnician, deleteLabTechnician, getPhysiotherapists, addPhysiotherapist, updatePhysiotherapist, deletePhysiotherapist } from '@/lib/database'

interface Provider {
  id: number
  name: string
  email: string
  phone: string
  specialty: string
  experience_years: number
  license_number: string
  availability: string
}

type TabType = 'nurses' | 'technicians' | 'physiotherapists'

export default function ProvidersPage() {
  const [tab, setTab] = useState<TabType>('nurses')
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience_years: '',
    license_number: '',
    availability: 'available',
  })

  useEffect(() => {
    fetchProviders()
  }, [tab])

  const fetchProviders = async () => {
    setLoading(true)
    let result
    
    if (tab === 'nurses') {
      result = await getNurses()
    } else if (tab === 'technicians') {
      result = await getLabTechnicians()
    } else {
      result = await getPhysiotherapists()
    }
    
    if (result.error) {
      setError((result.error as any).message || 'حدث خطأ')
    } else {
      setProviders((result.data || []) as Provider[])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      experience_years: parseInt(formData.experience_years),
    }

    if (editingId) {
      if (tab === 'nurses') await updateNurse(editingId, submitData)
      else if (tab === 'technicians') await updateLabTechnician(editingId, submitData)
      else await updatePhysiotherapist(editingId, submitData)
    } else {
      if (tab === 'nurses') await addNurse(submitData)
      else if (tab === 'technicians') await addLabTechnician(submitData)
      else await addPhysiotherapist(submitData)
    }
    
    resetForm()
    fetchProviders()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد؟')) {
      if (tab === 'nurses') await deleteNurse(id)
      else if (tab === 'technicians') await deleteLabTechnician(id)
      else await deletePhysiotherapist(id)
      fetchProviders()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      experience_years: '',
      license_number: '',
      availability: 'available',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (provider: Provider) => {
    setFormData({
      ...provider,
      experience_years: provider.experience_years.toString(),
    })
    setEditingId(provider.id)
    setShowForm(true)
  }

  const tabNames: { [key in TabType]: string } = {
    nurses: 'الممرضات',
    technicians: 'فنيو المختبر',
    physiotherapists: 'المعالجون الفيزيائيون',
  }

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>
  if (error) return <div className="p-8 text-red-500">خطأ: {error}</div>

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">مقدمو الخدمة</h1>

        <div className="flex gap-4 mb-8 border-b">
          {Object.entries(tabNames).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key as TabType)
                resetForm()
              }}
              className={`px-4 py-2 font-bold ${
                tab === key
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{tabNames[tab as TabType]}</h2>
          <button
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? 'إغلاق' : `إضافة ${tabNames[tab as TabType]}`}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-8">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل' : 'إضافة'} {tabNames[tab as TabType]}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border p-2 rounded col-span-2"
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="التخصص"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="سنوات الخبرة"
                value={formData.experience_years}
                onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="رقم الترخيص"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                className="border p-2 rounded"
              />
              <select
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="border p-2 rounded col-span-2"
              >
                <option value="available">متاح</option>
                <option value="busy">مشغول</option>
                <option value="off_duty">في الإجازة</option>
              </select>
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
          {providers.map((provider) => (
            <div key={provider.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.specialty}</p>
              <p className="text-sm text-gray-600">{provider.email}</p>
              <p className="text-sm text-gray-600">{provider.phone}</p>
              <p className="text-sm mt-2">
                الخبرة: <strong>{provider.experience_years} سنة</strong>
              </p>
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  provider.availability === 'available' ? 'bg-green-200 text-green-800' :
                  provider.availability === 'busy' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {provider.availability}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(provider)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(provider.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            لا توجد {tabNames[tab as TabType]} حالياً
          </div>
        )}
      </div>
    </div>
  )
}
