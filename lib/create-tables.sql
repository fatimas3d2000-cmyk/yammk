-- ===== PATIENTS TABLE =====
CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PATIENT ADDRESSES =====
CREATE TABLE patient_addresses (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PATIENT SETTINGS =====
CREATE TABLE patient_settings (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'ar',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SERVICE CATALOG =====
CREATE TABLE service_catalog (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category TEXT,
  image_url TEXT,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NURSES =====
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

-- ===== LAB TECHNICIANS =====
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

-- ===== PHYSIOTHERAPISTS =====
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

-- ===== PROVIDER DOCUMENTS =====
CREATE TABLE provider_documents (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL,
  provider_type TEXT NOT NULL,
  document_type TEXT,
  document_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PROVIDER SERVICES =====
CREATE TABLE provider_services (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL,
  provider_type TEXT NOT NULL,
  service_id BIGINT NOT NULL REFERENCES service_catalog(id) ON DELETE CASCADE,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SERVICE ORDERS =====
CREATE TABLE service_orders (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id BIGINT,
  provider_type TEXT,
  service_id BIGINT REFERENCES service_catalog(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ORDER SERVICES =====
CREATE TABLE order_services (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  service_id BIGINT REFERENCES service_catalog(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ORDER ADDRESSES =====
CREATE TABLE order_addresses (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ORDER NOTES =====
CREATE TABLE order_notes (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ORDER PAYMENTS =====
CREATE TABLE order_payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PAYMENT TRANSACTIONS =====
CREATE TABLE payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES service_orders(id),
  patient_id BIGINT REFERENCES patients(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  transaction_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NOTIFICATIONS =====
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  user_type TEXT,
  title TEXT,
  message TEXT,
  type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== FAVORITES =====
CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id BIGINT NOT NULL,
  provider_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, provider_id, provider_type)
);

-- ===== REVIEWS =====
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL,
  provider_type TEXT NOT NULL,
  patient_id BIGINT REFERENCES patients(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CREATE INDEXES =====
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patient_addresses_patient_id ON patient_addresses(patient_id);
CREATE INDEX idx_service_orders_patient_id ON service_orders(patient_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_favorites_patient_id ON favorites(patient_id);

-- ===== ENABLE RLS (Row Level Security) =====
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== GRANT PERMISSIONS =====
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
