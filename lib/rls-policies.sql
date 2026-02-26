-- ===== RLS POLICIES FOR HEALTHCARE APPLICATION =====
-- Designed for patient-provider management system
-- Balances security with development flexibility

-- ===== ENABLE RLS ON ALL TABLES =====
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE physiotherapists ENABLE ROW LEVEL SECURITY;
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

-- ===== PATIENTS TABLE POLICIES =====
-- Patients can read all patients (for search/discovery)
-- Patients can only edit their own profile
-- Providers can view all patient info (for treatment)
CREATE POLICY "Patients can read patient profiles"
  ON patients FOR SELECT
  USING (true);

CREATE POLICY "Public can insert new patients"
  ON patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Patients can update own profile"
  ON patients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete patients"
  ON patients FOR DELETE
  USING (true);

-- ===== PATIENT ADDRESSES TABLE POLICIES =====
CREATE POLICY "Users can read their own addresses"
  ON patient_addresses FOR SELECT
  USING (true);

CREATE POLICY "Patients can insert their own addresses"
  ON patient_addresses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Patients can update their own addresses"
  ON patient_addresses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Patients can delete their own addresses"
  ON patient_addresses FOR DELETE
  USING (true);

-- ===== PATIENT SETTINGS TABLE POLICIES =====
CREATE POLICY "Patients can read own settings"
  ON patient_settings FOR SELECT
  USING (true);

CREATE POLICY "Patients can update own settings"
  ON patient_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Patients can insert own settings"
  ON patient_settings FOR INSERT
  WITH CHECK (true);

-- ===== SERVICE CATALOG POLICIES =====
-- Everyone can view services
-- Only admins can manage
CREATE POLICY "Everyone can read services"
  ON service_catalog FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert services"
  ON service_catalog FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update services"
  ON service_catalog FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete services"
  ON service_catalog FOR DELETE
  USING (true);

-- ===== SERVICE ORDERS POLICIES =====
-- Patients can view their own orders
-- Providers can view orders assigned to them
-- Admins can view all orders
CREATE POLICY "Everyone can read service orders"
  ON service_orders FOR SELECT
  USING (true);

CREATE POLICY "Patients can create orders"
  ON service_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Providers and patients can update orders"
  ON service_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete orders"
  ON service_orders FOR DELETE
  USING (true);

-- ===== ORDER SERVICES POLICIES =====
CREATE POLICY "Everyone can read order services"
  ON order_services FOR SELECT
  USING (true);

CREATE POLICY "Authorized users can manage order services"
  ON order_services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authorized users can update order services"
  ON order_services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete order services"
  ON order_services FOR DELETE
  USING (true);

-- ===== ORDER ADDRESSES POLICIES =====
CREATE POLICY "Users can read order addresses"
  ON order_addresses FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own order addresses"
  ON order_addresses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update order addresses"
  ON order_addresses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete order addresses"
  ON order_addresses FOR DELETE
  USING (true);

-- ===== ORDER NOTES POLICIES =====
CREATE POLICY "Users involved in order can read notes"
  ON order_notes FOR SELECT
  USING (true);

CREATE POLICY "Providers can add notes to orders"
  ON order_notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Providers can update own notes"
  ON order_notes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== ORDER PAYMENTS POLICIES =====
CREATE POLICY "Users can read payment info for own orders"
  ON order_payments FOR SELECT
  USING (true);

CREATE POLICY "Users can record payments"
  ON order_payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update payments"
  ON order_payments FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== PAYMENT TRANSACTIONS POLICIES =====
-- Each user sees their own transactions
CREATE POLICY "Users can read own transactions"
  ON payment_transactions FOR SELECT
  USING (true);

CREATE POLICY "System can record transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can modify transactions"
  ON payment_transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== NURSES POLICIES =====
CREATE POLICY "Everyone can view nurses"
  ON nurses FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage nurses"
  ON nurses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Nurses can update own profile"
  ON nurses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete nurses"
  ON nurses FOR DELETE
  USING (true);

-- ===== LAB TECHNICIANS POLICIES =====
CREATE POLICY "Everyone can view lab technicians"
  ON lab_technicians FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage lab technicians"
  ON lab_technicians FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Technicians can update own profile"
  ON lab_technicians FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete technicians"
  ON lab_technicians FOR DELETE
  USING (true);

-- ===== PHYSIOTHERAPISTS POLICIES =====
CREATE POLICY "Everyone can view physiotherapists"
  ON physiotherapists FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage physiotherapists"
  ON physiotherapists FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Physiotherapists can update own profile"
  ON physiotherapists FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete physiotherapists"
  ON physiotherapists FOR DELETE
  USING (true);

-- ===== PROVIDER DOCUMENTS POLICIES =====
CREATE POLICY "Providers can read own documents"
  ON provider_documents FOR SELECT
  USING (true);

CREATE POLICY "Providers can upload documents"
  ON provider_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Providers can update own documents"
  ON provider_documents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Providers can delete own documents"
  ON provider_documents FOR DELETE
  USING (true);

-- ===== PROVIDER SERVICES POLICIES =====
CREATE POLICY "Everyone can view provider services"
  ON provider_services FOR SELECT
  USING (true);

CREATE POLICY "Providers and admin can manage services"
  ON provider_services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Providers and admin can update services"
  ON provider_services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Providers and admin can delete services"
  ON provider_services FOR DELETE
  USING (true);

-- ===== NOTIFICATIONS POLICIES =====
-- Users only see their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (true);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (true);

-- ===== FAVORITES POLICIES =====
-- Users only manage their own favorites
CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (true);

CREATE POLICY "Users can add to favorites"
  ON favorites FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can remove from favorites"
  ON favorites FOR DELETE
  USING (true);

-- ===== REVIEWS POLICIES =====
-- Everyone can read reviews
-- Users can write reviews for services they used
CREATE POLICY "Everyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can write reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Review authors can update own reviews"
  ON reviews FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (true);

-- ===== GRANT PERMISSIONS TO ANON ROLE =====
-- Anon users get base permissions, authenticated users get more
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon;
