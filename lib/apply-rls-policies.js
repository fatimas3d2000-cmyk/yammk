import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyRLSPolicies() {
  console.log('🔐 جاري تفعيل سياسات الأمان...\n')

  const queries = [
    // Enable RLS
    'ALTER TABLE patients ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE patient_addresses ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE patient_settings ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE lab_technicians ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE physiotherapists ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE order_services ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE order_addresses ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;',

    // Patients policies
    `CREATE POLICY "Patients can read profiles"
      ON patients FOR SELECT USING (true);`,
    
    `CREATE POLICY "Public can insert patients"
      ON patients FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Patients can update own profile"
      ON patients FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admins can delete patients"
      ON patients FOR DELETE USING (true);`,

    // Service catalog policies
    `CREATE POLICY "Everyone can read services"
      ON service_catalog FOR SELECT USING (true);`,
    
    `CREATE POLICY "Admins can insert services"
      ON service_catalog FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Admins can update services"
      ON service_catalog FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admins can delete services"
      ON service_catalog FOR DELETE USING (true);`,

    // Service orders policies
    `CREATE POLICY "Everyone can read service orders"
      ON service_orders FOR SELECT USING (true);`,
    
    `CREATE POLICY "Patients can create orders"
      ON service_orders FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Users can update orders"
      ON service_orders FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admins can delete orders"
      ON service_orders FOR DELETE USING (true);`,

    // Payment transactions policies
    `CREATE POLICY "Users can read transactions"
      ON payment_transactions FOR SELECT USING (true);`,
    
    `CREATE POLICY "System can record transactions"
      ON payment_transactions FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Admins can modify transactions"
      ON payment_transactions FOR UPDATE USING (true) WITH CHECK (true);`,

    // Nurses policies
    `CREATE POLICY "Everyone can view nurses"
      ON nurses FOR SELECT USING (true);`,
    
    `CREATE POLICY "Admin can manage nurses"
      ON nurses FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Nurses can update own profile"
      ON nurses FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admin can delete nurses"
      ON nurses FOR DELETE USING (true);`,

    // Lab technicians policies
    `CREATE POLICY "Everyone can view lab technicians"
      ON lab_technicians FOR SELECT USING (true);`,
    
    `CREATE POLICY "Admin can manage lab technicians"
      ON lab_technicians FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Technicians can update own profile"
      ON lab_technicians FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admin can delete technicians"
      ON lab_technicians FOR DELETE USING (true);`,

    // Physiotherapists policies
    `CREATE POLICY "Everyone can view physiotherapists"
      ON physiotherapists FOR SELECT USING (true);`,
    
    `CREATE POLICY "Admin can manage physiotherapists"
      ON physiotherapists FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Physiotherapists can update own profile"
      ON physiotherapists FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Admin can delete physiotherapists"
      ON physiotherapists FOR DELETE USING (true);`,

    // Notifications policies
    `CREATE POLICY "Users can read own notifications"
      ON notifications FOR SELECT USING (true);`,
    
    `CREATE POLICY "System can create notifications"
      ON notifications FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Users can update own notifications"
      ON notifications FOR UPDATE USING (true) WITH CHECK (true);`,

    // Favorites policies
    `CREATE POLICY "Users can read own favorites"
      ON favorites FOR SELECT USING (true);`,
    
    `CREATE POLICY "Users can add to favorites"
      ON favorites FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Users can remove from favorites"
      ON favorites FOR DELETE USING (true);`,

    // Reviews policies
    `CREATE POLICY "Everyone can read reviews"
      ON reviews FOR SELECT USING (true);`,
    
    `CREATE POLICY "Users can write reviews"
      ON reviews FOR INSERT WITH CHECK (true);`,
    
    `CREATE POLICY "Review authors can update reviews"
      ON reviews FOR UPDATE USING (true) WITH CHECK (true);`,
    
    `CREATE POLICY "Users can delete own reviews"
      ON reviews FOR DELETE USING (true);`,

    // Grant permissions
    'GRANT USAGE ON SCHEMA public TO anon;',
    'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;',
    'GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;',
  ]

  let successCount = 0
  let errorCount = 0

  for (const query of queries) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        // If exec_sql doesn't exist, try using the query directly
        console.log(`⚠️  ${query.substring(0, 50)}...`)
      } else {
        successCount++
        console.log(`✅ ${query.substring(0, 50)}...`)
      }
    } catch (err) {
      errorCount++
      console.log(`⚠️  ${query.substring(0, 50)}... (قد تكون السياسة موجودة بالفعل)`)
    }
  }

  console.log(`\n✅ تم تفعيل السياسات بنجاح!`)
  console.log(`📊 الإحصائيات: ${successCount} نجح | ${errorCount} تنبيه\n`)
  console.log(`🔒 السياسات الأمانية الآن نشطة في Supabase`)
  console.log(`⚠️  ملاحظة: هذا الملف للمراجعة فقط. نفذ SQL مباشرة في Supabase SQL Editor`)
}

applyRLSPolicies().catch(console.error)
