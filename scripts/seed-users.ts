import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Sample users to seed
const sampleUsers = [
  {
    full_name: "د. محمد أحمد السعيد",
    email: "doctor@example.com",
    phone: "0501234567",
    password: "Doctor@123",
    user_type: "provider",
    is_active: true,
  },
  {
    full_name: "أحمد محمد علي",
    email: "patient1@example.com",
    phone: "0502345678",
    password: "Patient@123",
    user_type: "patient",
    is_active: true,
  },
  {
    full_name: "فاطمة الزهراء محمود",
    email: "patient2@example.com",
    phone: "0503456789",
    password: "Patient@123",
    user_type: "patient",
    is_active: true,
  },
  {
    full_name: "سارة حسن إبراهيم",
    email: "nurse@example.com",
    phone: "0504567890",
    password: "Nurse@123",
    user_type: "provider",
    is_active: true,
  },
  {
    full_name: "علي محمود عبدالله",
    email: "therapist@example.com",
    phone: "0505678901",
    password: "Therapist@123",
    user_type: "provider",
    is_active: true,
  },
];

async function seedUsers() {
  try {
    console.log("🌱 بدء إضافة المستخدمين التجريبيين...\n");

    for (const user of sampleUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("patients")
        .select("email")
        .eq("email", user.email)
        .single();

      if (existingUser) {
        console.log(`⏭️  المستخدم ${user.email} موجود بالفعل, تم التخطي`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      const { data, error } = await supabase
        .from("patients")
        .insert([
          {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            password: hashedPassword,
            user_type: user.user_type,
            is_active: user.is_active,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error(`❌ خطأ في إضافة ${user.email}:`, error.message);
      } else {
        console.log(`✅ تم إضافة المستخدم: ${user.full_name}`);
        console.log(`   📧 البريد: ${user.email}`);
        console.log(`   🔑 كلمة المرور: ${user.password}`);
        console.log(`   👤 النوع: ${user.user_type === "provider" ? "مزود" : "مريض"}\n`);
      }
    }

    console.log("✨ انتهت عملية إضافة المستخدمين!");
  } catch (error) {
    console.error("خطأ في العملية:", error);
    process.exit(1);
  }
}

seedUsers();
