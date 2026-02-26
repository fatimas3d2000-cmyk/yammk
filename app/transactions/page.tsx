'use client'

import { useEffect, useState } from 'react'
import { getPaymentTransactions, addPaymentTransaction, updatePaymentTransaction, deletePaymentTransaction } from '@/lib/database'

interface Transaction {
  id: number
  order_id: number
  patient_id: number
  amount: number
  payment_method: string
  status: string
  transaction_ref: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    order_id: '',
    patient_id: '',
    amount: '',
    payment_method: 'card',
    status: 'pending',
    transaction_ref: '',
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await getPaymentTransactions()
    if (error) {
      setError((error as any).message || 'حدث خطأ')
    } else {
      setTransactions((data || []) as Transaction[])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      await updatePaymentTransaction(editingId, {
        ...formData,
        amount: parseFloat(formData.amount),
      })
    } else {
      await addPaymentTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      })
    }
    
    resetForm()
    fetchTransactions()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد؟')) {
      await deletePaymentTransaction(id)
      fetchTransactions()
    }
  }

  const resetForm = () => {
    setFormData({
      order_id: '',
      patient_id: '',
      amount: '',
      payment_method: 'card',
      status: 'pending',
      transaction_ref: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      order_id: transaction.order_id.toString(),
      patient_id: transaction.patient_id.toString(),
      amount: transaction.amount.toString(),
      payment_method: transaction.payment_method,
      status: transaction.status,
      transaction_ref: transaction.transaction_ref,
    })
    setEditingId(transaction.id)
    setShowForm(true)
  }

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-200 text-yellow-800',
      completed: 'bg-green-200 text-green-800',
      failed: 'bg-red-200 text-red-800',
      refunded: 'bg-gray-200 text-gray-800',
    }
    return colors[status] || 'bg-gray-200 text-gray-800'
  }

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>
  if (error) return <div className="p-8 text-red-500">خطأ: {error}</div>

  const totalRevenue = transactions
    .filter((t: Transaction) => t.status === 'completed')
    .reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">المعاملات المالية</h1>
            <p className="text-gray-600 mt-2">إجمالي الإيرادات: <strong className="text-green-600">${totalRevenue.toFixed(2)}</strong></p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? 'إغلاق' : 'معاملة جديدة'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-6 rounded mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'تعديل المعاملة' : 'إضافة معاملة جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="معرف الطلب"
                value={formData.order_id}
                onChange={(e) => setFormData({...formData, order_id: e.target.value})}
                className="border p-2 rounded"
                required
              />
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
                placeholder="المبلغ"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="border p-2 rounded"
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="رقم المرجع"
                value={formData.transaction_ref}
                onChange={(e) => setFormData({...formData, transaction_ref: e.target.value})}
                className="border p-2 rounded"
              />
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                className="border p-2 rounded"
              >
                <option value="card">بطاقة ائتمان</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="cash">نقدي</option>
                <option value="wallet">محفظة</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="border p-2 rounded"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="completed">مكتملة</option>
                <option value="failed">فشلت</option>
                <option value="refunded">مرجعة</option>
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-right">معرف</th>
                <th className="border p-3 text-right">المريض</th>
                <th className="border p-3 text-right">المبلغ</th>
                <th className="border p-3 text-right">الطريقة</th>
                <th className="border p-3 text-right">الحالة</th>
                <th className="border p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="border p-3">{transaction.id}</td>
                  <td className="border p-3">{transaction.patient_id}</td>
                  <td className="border p-3 font-bold">${transaction.amount?.toFixed(2)}</td>
                  <td className="border p-3">{transaction.payment_method}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded text-sm ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm mr-2"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
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

        {transactions.length === 0 && (
          <div className="text-center text-gray-500 py-8">لم تتم أي معاملات حالياً</div>
        )}
      </div>
    </div>
  )
}
