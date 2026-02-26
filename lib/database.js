import { supabase } from './supabaseClient'

// ==================== PATIENTS ====================

export const getPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
  return { data, error }
}

export const getPatientById = async (id) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addPatient = async (patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
  return { data, error }
}

export const updatePatient = async (id, patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .update(patientData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deletePatient = async (id) => {
  const { data, error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PATIENT ADDRESSES ====================

export const getPatientAddresses = async (patientId) => {
  const { data, error } = await supabase
    .from('patient_addresses')
    .select('*')
    .eq('patient_id', patientId)
  return { data, error }
}

export const addPatientAddress = async (addressData) => {
  const { data, error } = await supabase
    .from('patient_addresses')
    .insert([addressData])
    .select()
  return { data, error }
}

export const updatePatientAddress = async (id, addressData) => {
  const { data, error } = await supabase
    .from('patient_addresses')
    .update(addressData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deletePatientAddress = async (id) => {
  const { data, error } = await supabase
    .from('patient_addresses')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PATIENT SETTINGS ====================

export const getPatientSettings = async (patientId) => {
  const { data, error } = await supabase
    .from('patient_settings')
    .select('*')
    .eq('patient_id', patientId)
    .single()
  return { data, error }
}

export const updatePatientSettings = async (patientId, settings) => {
  const { data, error } = await supabase
    .from('patient_settings')
    .update(settings)
    .eq('patient_id', patientId)
    .select()
  return { data, error }
}

// ==================== SERVICE CATALOG ====================

export const getServiceCatalog = async () => {
  const { data, error } = await supabase
    .from('service_catalog')
    .select('*')
  return { data, error }
}

export const getServiceById = async (id) => {
  const { data, error } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addService = async (serviceData) => {
  const { data, error } = await supabase
    .from('service_catalog')
    .insert([serviceData])
    .select()
  return { data, error }
}

export const updateService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('service_catalog')
    .update(serviceData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteService = async (id) => {
  const { data, error } = await supabase
    .from('service_catalog')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== NURSES ====================

export const getNurses = async () => {
  const { data, error } = await supabase
    .from('nurses')
    .select('*')
  return { data, error }
}

export const getNurseById = async (id) => {
  const { data, error } = await supabase
    .from('nurses')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addNurse = async (nurseData) => {
  const { data, error } = await supabase
    .from('nurses')
    .insert([nurseData])
    .select()
  return { data, error }
}

export const updateNurse = async (id, nurseData) => {
  const { data, error } = await supabase
    .from('nurses')
    .update(nurseData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteNurse = async (id) => {
  const { data, error } = await supabase
    .from('nurses')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== LAB TECHNICIANS ====================

export const getLabTechnicians = async () => {
  const { data, error } = await supabase
    .from('lab_technicians')
    .select('*')
  return { data, error }
}

export const getLabTechnicianById = async (id) => {
  const { data, error } = await supabase
    .from('lab_technicians')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addLabTechnician = async (technicianData) => {
  const { data, error } = await supabase
    .from('lab_technicians')
    .insert([technicianData])
    .select()
  return { data, error }
}

export const updateLabTechnician = async (id, technicianData) => {
  const { data, error } = await supabase
    .from('lab_technicians')
    .update(technicianData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteLabTechnician = async (id) => {
  const { data, error } = await supabase
    .from('lab_technicians')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PHYSIOTHERAPISTS ====================

export const getPhysiotherapists = async () => {
  const { data, error } = await supabase
    .from('physiotherapists')
    .select('*')
  return { data, error }
}

export const getPhysiotherapistById = async (id) => {
  const { data, error } = await supabase
    .from('physiotherapists')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addPhysiotherapist = async (therapistData) => {
  const { data, error } = await supabase
    .from('physiotherapists')
    .insert([therapistData])
    .select()
  return { data, error }
}

export const updatePhysiotherapist = async (id, therapistData) => {
  const { data, error } = await supabase
    .from('physiotherapists')
    .update(therapistData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deletePhysiotherapist = async (id) => {
  const { data, error } = await supabase
    .from('physiotherapists')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PROVIDER DOCUMENTS ====================

export const getProviderDocuments = async (providerId) => {
  const { data, error } = await supabase
    .from('provider_documents')
    .select('*')
    .eq('provider_id', providerId)
  return { data, error }
}

export const addProviderDocument = async (documentData) => {
  const { data, error } = await supabase
    .from('provider_documents')
    .insert([documentData])
    .select()
  return { data, error }
}

export const updateProviderDocument = async (id, documentData) => {
  const { data, error } = await supabase
    .from('provider_documents')
    .update(documentData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteProviderDocument = async (id) => {
  const { data, error } = await supabase
    .from('provider_documents')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PROVIDER SERVICES ====================

export const getProviderServices = async (providerId) => {
  const { data, error } = await supabase
    .from('provider_services')
    .select('*')
    .eq('provider_id', providerId)
  return { data, error }
}

export const addProviderService = async (serviceData) => {
  const { data, error } = await supabase
    .from('provider_services')
    .insert([serviceData])
    .select()
  return { data, error }
}

export const updateProviderService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('provider_services')
    .update(serviceData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteProviderService = async (id) => {
  const { data, error } = await supabase
    .from('provider_services')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== SERVICE ORDERS ====================

export const getServiceOrders = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
  return { data, error }
}

export const getServiceOrderById = async (id) => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const getPatientOrders = async (patientId) => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .eq('patient_id', patientId)
  return { data, error }
}

export const addServiceOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('service_orders')
    .insert([orderData])
    .select()
  return { data, error }
}

export const updateServiceOrder = async (id, orderData) => {
  const { data, error } = await supabase
    .from('service_orders')
    .update(orderData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteServiceOrder = async (id) => {
  const { data, error } = await supabase
    .from('service_orders')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== ORDER SERVICES ====================

export const getOrderServices = async (orderId) => {
  const { data, error } = await supabase
    .from('order_services')
    .select('*')
    .eq('order_id', orderId)
  return { data, error }
}

export const addOrderService = async (orderServiceData) => {
  const { data, error } = await supabase
    .from('order_services')
    .insert([orderServiceData])
    .select()
  return { data, error }
}

export const updateOrderService = async (id, orderServiceData) => {
  const { data, error } = await supabase
    .from('order_services')
    .update(orderServiceData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteOrderService = async (id) => {
  const { data, error } = await supabase
    .from('order_services')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== ORDER ADDRESSES ====================

export const getOrderAddresses = async (orderId) => {
  const { data, error } = await supabase
    .from('order_addresses')
    .select('*')
    .eq('order_id', orderId)
  return { data, error }
}

export const addOrderAddress = async (addressData) => {
  const { data, error } = await supabase
    .from('order_addresses')
    .insert([addressData])
    .select()
  return { data, error }
}

export const updateOrderAddress = async (id, addressData) => {
  const { data, error } = await supabase
    .from('order_addresses')
    .update(addressData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteOrderAddress = async (id) => {
  const { data, error } = await supabase
    .from('order_addresses')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== ORDER NOTES ====================

export const getOrderNotes = async (orderId) => {
  const { data, error } = await supabase
    .from('order_notes')
    .select('*')
    .eq('order_id', orderId)
  return { data, error }
}

export const addOrderNote = async (noteData) => {
  const { data, error } = await supabase
    .from('order_notes')
    .insert([noteData])
    .select()
  return { data, error }
}

export const updateOrderNote = async (id, noteData) => {
  const { data, error } = await supabase
    .from('order_notes')
    .update(noteData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteOrderNote = async (id) => {
  const { data, error } = await supabase
    .from('order_notes')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== ORDER PAYMENTS ====================

export const getOrderPayments = async (orderId) => {
  const { data, error } = await supabase
    .from('order_payments')
    .select('*')
    .eq('order_id', orderId)
  return { data, error }
}

export const addOrderPayment = async (paymentData) => {
  const { data, error } = await supabase
    .from('order_payments')
    .insert([paymentData])
    .select()
  return { data, error }
}

export const updateOrderPayment = async (id, paymentData) => {
  const { data, error } = await supabase
    .from('order_payments')
    .update(paymentData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteOrderPayment = async (id) => {
  const { data, error } = await supabase
    .from('order_payments')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== PAYMENT TRANSACTIONS ====================

export const getPaymentTransactions = async () => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
  return { data, error }
}

export const getPaymentTransactionById = async (id) => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addPaymentTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert([transactionData])
    .select()
  return { data, error }
}

export const updatePaymentTransaction = async (id, transactionData) => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .update(transactionData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deletePaymentTransaction = async (id) => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== NOTIFICATIONS ====================

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const addNotification = async (notificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
  return { data, error }
}

export const updateNotification = async (id, notificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .update(notificationData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteNotification = async (id) => {
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
  return { data, error }
}

// ==================== FAVORITES ====================

export const getFavorites = async (patientId) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('patient_id', patientId)
  return { data, error }
}

export const addFavorite = async (favoriteData) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([favoriteData])
    .select()
  return { data, error }
}

export const removeFavorite = async (patientId, providerId) => {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('patient_id', patientId)
    .eq('provider_id', providerId)
  return { data, error }
}

// ==================== REVIEWS ====================

export const getReviews = async (providerId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getReviewById = async (id) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const addReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
  return { data, error }
}

export const updateReview = async (id, reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .update(reviewData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteReview = async (id) => {
  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
  return { data, error }
}
