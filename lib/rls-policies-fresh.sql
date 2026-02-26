-- ===== STEP 1: DELETE ALL EXISTING POLICIES COMPLETELY =====
-- This will remove all RLS policies from all tables

-- Disable and re-enable RLS to clear policies
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE nurses DISABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technicians DISABLE ROW LEVEL SECURITY;
ALTER TABLE physiotherapists DISABLE ROW LEVEL SECURITY;
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

-- Now enable them fresh
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

-- ===== STEP 2: CREATE NEW POLICIES =====

-- ===== PATIENTS TABLE POLICIES =====
CREATE POLICY "patients_read"
  ON patients FOR SELECT
  USING (true);

CREATE POLICY "patients_insert"
  ON patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "patients_update"
  ON patients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "patients_delete"
  ON patients FOR DELETE
  USING (true);

-- ===== PATIENT ADDRESSES TABLE POLICIES =====
CREATE POLICY "patient_addresses_read"
  ON patient_addresses FOR SELECT
  USING (true);

CREATE POLICY "patient_addresses_insert"
  ON patient_addresses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "patient_addresses_update"
  ON patient_addresses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "patient_addresses_delete"
  ON patient_addresses FOR DELETE
  USING (true);

-- ===== PATIENT SETTINGS TABLE POLICIES =====
CREATE POLICY "patient_settings_read"
  ON patient_settings FOR SELECT
  USING (true);

CREATE POLICY "patient_settings_insert"
  ON patient_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "patient_settings_update"
  ON patient_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== SERVICE CATALOG POLICIES =====
CREATE POLICY "service_catalog_read"
  ON service_catalog FOR SELECT
  USING (true);

CREATE POLICY "service_catalog_insert"
  ON service_catalog FOR INSERT
  WITH CHECK (true);

CREATE POLICY "service_catalog_update"
  ON service_catalog FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_catalog_delete"
  ON service_catalog FOR DELETE
  USING (true);

-- ===== SERVICE ORDERS POLICIES =====
CREATE POLICY "service_orders_read"
  ON service_orders FOR SELECT
  USING (true);

CREATE POLICY "service_orders_insert"
  ON service_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "service_orders_update"
  ON service_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_orders_delete"
  ON service_orders FOR DELETE
  USING (true);

-- ===== ORDER SERVICES POLICIES =====
CREATE POLICY "order_services_read"
  ON order_services FOR SELECT
  USING (true);

CREATE POLICY "order_services_insert"
  ON order_services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_services_update"
  ON order_services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "order_services_delete"
  ON order_services FOR DELETE
  USING (true);

-- ===== ORDER ADDRESSES POLICIES =====
CREATE POLICY "order_addresses_read"
  ON order_addresses FOR SELECT
  USING (true);

CREATE POLICY "order_addresses_insert"
  ON order_addresses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_addresses_update"
  ON order_addresses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "order_addresses_delete"
  ON order_addresses FOR DELETE
  USING (true);

-- ===== ORDER NOTES POLICIES =====
CREATE POLICY "order_notes_read"
  ON order_notes FOR SELECT
  USING (true);

CREATE POLICY "order_notes_insert"
  ON order_notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_notes_update"
  ON order_notes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== ORDER PAYMENTS POLICIES =====
CREATE POLICY "order_payments_read"
  ON order_payments FOR SELECT
  USING (true);

CREATE POLICY "order_payments_insert"
  ON order_payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_payments_update"
  ON order_payments FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== PAYMENT TRANSACTIONS POLICIES =====
CREATE POLICY "payment_transactions_read"
  ON payment_transactions FOR SELECT
  USING (true);

CREATE POLICY "payment_transactions_insert"
  ON payment_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "payment_transactions_update"
  ON payment_transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===== NURSES POLICIES =====
CREATE POLICY "nurses_read"
  ON nurses FOR SELECT
  USING (true);

CREATE POLICY "nurses_insert"
  ON nurses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "nurses_update"
  ON nurses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "nurses_delete"
  ON nurses FOR DELETE
  USING (true);

-- ===== LAB TECHNICIANS POLICIES =====
CREATE POLICY "lab_technicians_read"
  ON lab_technicians FOR SELECT
  USING (true);

CREATE POLICY "lab_technicians_insert"
  ON lab_technicians FOR INSERT
  WITH CHECK (true);

CREATE POLICY "lab_technicians_update"
  ON lab_technicians FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "lab_technicians_delete"
  ON lab_technicians FOR DELETE
  USING (true);

-- ===== PHYSIOTHERAPISTS POLICIES =====
CREATE POLICY "physiotherapists_read"
  ON physiotherapists FOR SELECT
  USING (true);

CREATE POLICY "physiotherapists_insert"
  ON physiotherapists FOR INSERT
  WITH CHECK (true);

CREATE POLICY "physiotherapists_update"
  ON physiotherapists FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "physiotherapists_delete"
  ON physiotherapists FOR DELETE
  USING (true);

-- ===== PROVIDER DOCUMENTS POLICIES =====
CREATE POLICY "provider_documents_read"
  ON provider_documents FOR SELECT
  USING (true);

CREATE POLICY "provider_documents_insert"
  ON provider_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "provider_documents_update"
  ON provider_documents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "provider_documents_delete"
  ON provider_documents FOR DELETE
  USING (true);

-- ===== PROVIDER SERVICES POLICIES =====
CREATE POLICY "provider_services_read"
  ON provider_services FOR SELECT
  USING (true);

CREATE POLICY "provider_services_insert"
  ON provider_services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "provider_services_update"
  ON provider_services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "provider_services_delete"
  ON provider_services FOR DELETE
  USING (true);

-- ===== NOTIFICATIONS POLICIES =====
CREATE POLICY "notifications_read"
  ON notifications FOR SELECT
  USING (true);

CREATE POLICY "notifications_insert"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "notifications_update"
  ON notifications FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "notifications_delete"
  ON notifications FOR DELETE
  USING (true);

-- ===== FAVORITES POLICIES =====
CREATE POLICY "favorites_read"
  ON favorites FOR SELECT
  USING (true);

CREATE POLICY "favorites_insert"
  ON favorites FOR INSERT
  WITH CHECK (true);

CREATE POLICY "favorites_delete"
  ON favorites FOR DELETE
  USING (true);

-- ===== REVIEWS POLICIES =====
CREATE POLICY "reviews_read"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "reviews_insert"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "reviews_update"
  ON reviews FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "reviews_delete"
  ON reviews FOR DELETE
  USING (true);

-- ===== GRANT PERMISSIONS TO ANON ROLE =====
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon;
