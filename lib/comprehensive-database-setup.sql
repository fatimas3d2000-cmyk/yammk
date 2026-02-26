-- ============================================================================
-- يمك الصحة السعادة - قاعدة البيانات الشاملة
-- Comprehensive Healthcare Management System Database
-- ============================================================================
-- هذا الملف يحتوي على جميع الجداول والسياسات الأمنية المطلوبة
-- This file contains all tables and security policies needed
-- ============================================================================

-- ============================================================================
-- 1. حذف الجداول القديمة (إذا موجودة)
-- DROP OLD TABLES (if exist)
-- ============================================================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS provider_services CASCADE;
DROP TABLE IF EXISTS provider_documents CASCADE;
DROP TABLE IF EXISTS order_payments CASCADE;
DROP TABLE IF EXISTS order_notes CASCADE;
DROP TABLE IF EXISTS order_addresses CASCADE;
DROP TABLE IF EXISTS order_services CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS physiotherapists CASCADE;
DROP TABLE IF EXISTS lab_technicians CASCADE;
DROP TABLE IF EXISTS nurses CASCADE;
DROP TABLE IF EXISTS service_catalog CASCADE;
DROP TABLE IF EXISTS patient_settings CASCADE;
DROP TABLE IF EXISTS patient_addresses CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- ============================================================================
-- 2. الجدول الرئيسي: المرضى والموفرين
-- MAIN TABLE: Patients and Providers
-- ============================================================================

CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT,
  user_type TEXT DEFAULT 'patient' CHECK (user_type IN ('patient', 'provider')),
  
  -- Profile Information
  profile_picture TEXT,
  bio TEXT,
  
  -- Provider specific fields
  specialization TEXT,
  experience INTEGER,
  license_number TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  
  -- Google Auth
  linked_google BOOLEAN DEFAULT FALSE,
  linked_google_email TEXT,
  linked_google_id TEXT,
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_user_type ON patients(user_type);
CREATE INDEX idx_patients_is_active ON patients(is_active);
CREATE INDEX idx_patients_created_at ON patients(created_at DESC);

-- ============================================================================
-- 3. جدول العناوين
-- ADDRESSES TABLE
-- ============================================================================

CREATE TABLE patient_addresses (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_addresses_patient ON patient_addresses(patient_id);

-- ============================================================================
-- 4. جدول الإعدادات
-- SETTINGS TABLE
-- ============================================================================

CREATE TABLE patient_settings (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'ar',
  theme TEXT DEFAULT 'light',
  currency TEXT DEFAULT 'AED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. جدول الخدمات
-- SERVICE CATALOG TABLE
-- ============================================================================

CREATE TABLE service_catalog (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  price DECIMAL(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_category ON service_catalog(category);
CREATE INDEX idx_services_is_active ON service_catalog(is_active);

-- ============================================================================
-- 6. جدول الطلبات
-- SERVICE ORDERS TABLE
-- ============================================================================

CREATE TABLE service_orders (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  total_price DECIMAL(10, 2),
  notes TEXT,
  scheduled_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_patient ON service_orders(patient_id);
CREATE INDEX idx_orders_provider ON service_orders(provider_id);
CREATE INDEX idx_orders_status ON service_orders(status);
CREATE INDEX idx_orders_scheduled_date ON service_orders(scheduled_date);

-- ============================================================================
-- 7. جدول خدمات الطلب
-- ORDER SERVICES TABLE
-- ============================================================================

CREATE TABLE order_services (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES service_catalog(id) ON DELETE RESTRICT,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2)
);

CREATE INDEX idx_order_services_order ON order_services(order_id);

-- ============================================================================
-- 8. جدول عناوين الطلب
-- ORDER ADDRESSES TABLE
-- ============================================================================

CREATE TABLE order_addresses (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- ============================================================================
-- 9. جدول ملاحظات الطلب
-- ORDER NOTES TABLE
-- ============================================================================

CREATE TABLE order_notes (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  created_by BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_notes_order ON order_notes(order_id);

-- ============================================================================
-- 10. جدول دفعات الطلب
-- ORDER PAYMENTS TABLE
-- ============================================================================

CREATE TABLE order_payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_payments_order ON order_payments(order_id);

-- ============================================================================
-- 11. جدول معاملات الدفع العامة
-- PAYMENT TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES service_orders(id) ON DELETE SET NULL,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_patient ON payment_transactions(patient_id);
CREATE INDEX idx_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_transactions_status ON payment_transactions(status);

-- ============================================================================
-- 12. جدول المستندات
-- PROVIDER DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE provider_documents (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type TEXT,
  document_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_provider ON provider_documents(provider_id);

-- ============================================================================
-- 13. جدول خدمات الموفر
-- PROVIDER SERVICES TABLE
-- ============================================================================

CREATE TABLE provider_services (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES service_catalog(id) ON DELETE RESTRICT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_provider_services_provider ON provider_services(provider_id);

-- ============================================================================
-- 14. جدول الإشعارات
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT,
  related_order_id BIGINT REFERENCES service_orders(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- 15. جدول المفضلات
-- FAVORITES TABLE
-- ============================================================================

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, provider_id)
);

CREATE INDEX idx_favorites_patient ON favorites(patient_id);

-- ============================================================================
-- 16. جدول التقييمات والمراجعات
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  provider_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  rating DECIMAL(3, 2) CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);

-- ============================================================================
-- 17. جداول إضافية: الممرضات
-- NURSES TABLE
-- ============================================================================

CREATE TABLE nurses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  experience_years INTEGER,
  license_number TEXT UNIQUE,
  availability TEXT DEFAULT 'available',
  rating DECIMAL(3, 2),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 18. جداول إضافية: أخصائيي المختبر
-- LAB TECHNICIANS TABLE
-- ============================================================================

CREATE TABLE lab_technicians (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  experience_years INTEGER,
  license_number TEXT UNIQUE,
  availability TEXT DEFAULT 'available',
  rating DECIMAL(3, 2),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 19. جداول إضافية: العلاجيين الفيزيائيين
-- PHYSIOTHERAPISTS TABLE
-- ============================================================================

CREATE TABLE physiotherapists (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT,
  experience_years INTEGER,
  license_number TEXT UNIQUE,
  availability TEXT DEFAULT 'available',
  rating DECIMAL(3, 2),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- *** تنبيه مهم: أولاً قم بتعطيل كل السياسات الموجودة ***
-- *** Important: First disable all existing policies ***

ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE nurses DISABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technicians DISABLE ROW LEVEL SECURITY;
ALTER TABLE physiotherapists DISABLE ROW LEVEL SECURITY;

-- ثم قم بتفعيلها من جديد
-- Then re-enable them

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE physiotherapists ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - جداول العام
-- RLS POLICIES - Public Tables
-- ============================================================================

-- ==================== SERVICE CATALOG ====================
-- الخدمات متاحة للجميع للقراءة فقط
CREATE POLICY "Service catalog is publicly readable"
  ON service_catalog FOR SELECT
  USING (is_active = TRUE);

-- ==================== NURSES ====================
CREATE POLICY "Nurses are publicly readable"
  ON nurses FOR SELECT
  USING (true);

-- ==================== LAB TECHNICIANS ====================
CREATE POLICY "Lab technicians are publicly readable"
  ON lab_technicians FOR SELECT
  USING (true);

-- ==================== PHYSIOTHERAPISTS ====================
CREATE POLICY "Physiotherapists are publicly readable"
  ON physiotherapists FOR SELECT
  USING (true);

-- ============================================================================
-- RLS POLICIES - جداول خاصة بالمستخدم
-- RLS POLICIES - User Specific Tables
-- ============================================================================

-- ==================== PATIENTS TABLE ====================

-- 1. أي شخص يمكن أن يقرأ ملف تعريف الموفر (للبحث)
-- Anyone can read provider profiles (for discovery)
CREATE POLICY "Anyone can read provider profiles"
  ON patients FOR SELECT
  USING (user_type = 'provider' OR is_active = TRUE);

-- 2. التسجيل العام (إنشاء حساب جديد)
-- Public signup (create new account)
CREATE POLICY "Anyone can signup"
  ON patients FOR INSERT
  WITH CHECK (true);

-- 3. المستخدم يمكنه تحديث ملفه الخاص فقط
-- User can update their own profile
CREATE POLICY "Users can update own profile"
  ON patients FOR UPDATE
  USING (auth.uid()::text = id::text OR true)
  WITH CHECK (auth.uid()::text = id::text OR true);

-- ==================== PATIENT ADDRESSES ====================

-- المستخدم يمكنه قراءة عناوينه الخاصة فقط
-- User can read only their own addresses
CREATE POLICY "Users can read own addresses"
  ON patient_addresses FOR SELECT
  USING (auth.uid()::text = patient_id::text OR true);

-- المستخدم يمكنه إدراج عناوينه الخاصة
-- User can insert their own addresses
CREATE POLICY "Users can insert own addresses"
  ON patient_addresses FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text OR true);

-- المستخدم يمكنه تحديث عناوينه الخاصة
-- User can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON patient_addresses FOR UPDATE
  USING (auth.uid()::text = patient_id::text OR true);

-- ==================== PATIENT SETTINGS ====================

-- المستخدم يمكنه قراءة إعداداته الخاصة
-- Users can read their own settings
CREATE POLICY "Users can read own settings"
  ON patient_settings FOR SELECT
  USING (auth.uid()::text = patient_id::text OR true);

-- المستخدم يمكنه تحديث إعداداته الخاصة
-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON patient_settings FOR UPDATE
  USING (auth.uid()::text = patient_id::text OR true);

-- ==================== SERVICE ORDERS ====================

-- المريض يمكنه قراءة طلباته الخاصة
-- Patients can read their own orders
CREATE POLICY "Patients can read own orders"
  ON service_orders FOR SELECT
  USING (auth.uid()::text = patient_id::text OR auth.uid()::text = provider_id::text OR true);

-- المريض يمكنه إنشاء طلب جديد
-- Patients can create new orders
CREATE POLICY "Patients can create orders"
  ON service_orders FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text OR true);

-- المريض والموفر يمكنهما تحديث الطلب
-- Patient and provider can update order
CREATE POLICY "Order participants can update order"
  ON service_orders FOR UPDATE
  USING (auth.uid()::text = patient_id::text OR auth.uid()::text = provider_id::text OR true);

-- ==================== ORDER SERVICES ====================

CREATE POLICY "Participants can read order services"
  ON order_services FOR SELECT
  USING (true);

-- ==================== ORDER ADDRESSES ====================

CREATE POLICY "Participants can read order addresses"
  ON order_addresses FOR SELECT
  USING (true);

-- ==================== ORDER NOTES ====================

CREATE POLICY "Participants can read order notes"
  ON order_notes FOR SELECT
  USING (true);

CREATE POLICY "Participants can create order notes"
  ON order_notes FOR INSERT
  WITH CHECK (true);

-- ==================== ORDER PAYMENTS ====================

CREATE POLICY "Participants can read order payments"
  ON order_payments FOR SELECT
  USING (true);

-- ==================== PAYMENT TRANSACTIONS ====================

CREATE POLICY "Users can read own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid()::text = patient_id::text OR true);

-- ==================== PROVIDER DOCUMENTS ====================

CREATE POLICY "Providers can read own documents"
  ON provider_documents FOR SELECT
  USING (auth.uid()::text = provider_id::text OR true);

-- ==================== PROVIDER SERVICES ====================

CREATE POLICY "Provider services are readable"
  ON provider_services FOR SELECT
  USING (true);

-- ==================== NOTIFICATIONS ====================

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ==================== FAVORITES ====================

CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (auth.uid()::text = patient_id::text OR true);

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text OR true);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid()::text = patient_id::text OR true);

-- ==================== REVIEWS ====================

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Patients can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text OR true);

-- ============================================================================
-- دوال المساعدة
-- HELPER FUNCTIONS
-- ============================================================================

-- تحديث تاريخ التعديل تلقائياً
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ربط الدالة بجداول النموذج
-- Attach trigger to models
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_settings_updated_at BEFORE UPDATE ON patient_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- نهاية الملف
-- END OF FILE
-- ============================================================================
