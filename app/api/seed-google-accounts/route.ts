import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key for direct DB access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    console.log("🌱 إضافة بيانات تجريبية...");

    // التحقق من وجود حسابات بالفعل
    const { data: existingAccounts, error: checkError } = await supabase
      .from("patients")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ خطأ في التحقق:", checkError);
    }

    if (existingAccounts && existingAccounts.length > 0) {
      console.log("✅ توجد حسابات بالفعل");
      return NextResponse.json({
        success: true,
        message: "توجد حسابات بالفعل في قاعدة البيانات",
        accountCount: existingAccounts.length,
      });
    }

    // إضافة حسابات تجريبية
    const sampleAccounts = [
      {
        full_name: "أحمد محمد",
        email: "ahmad@example.com",
        phone: "0501234567",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeJ.G4ztMSUF5fbcWqVsK/PV5KE/4qEKO", // bcrypt for "password"
        user_type: "patient",
        is_active: true,
        profile_picture: null,
        linked_google: false,
      },
      {
        full_name: "فاطمة علي",
        email: "fatima@example.com",
        phone: "0502345678",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeJ.G4ztMSUF5fbcWqVsK/PV5KE/4qEKO",
        user_type: "patient",
        is_active: true,
        profile_picture: null,
        linked_google: false,
      },
      {
        full_name: "د. محمود علي",
        email: "dr.mahmoud@example.com",
        phone: "0503456789",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeJ.G4ztMSUF5fbcWqVsK/PV5KE/4qEKO",
        user_type: "provider",
        is_active: true,
        profile_picture: null,
        specialization: "تمريض منزلي",
        linked_google: false,
      },
      {
        full_name: "د. سارة حسن",
        email: "dr.sarah@example.com",
        phone: "0504567890",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeJ.G4ztMSUF5fbcWqVsK/PV5KE/4qEKO",
        user_type: "provider",
        is_active: true,
        profile_picture: null,
        specialization: "فحص دم",
        linked_google: false,
      },
    ];

    console.log("📝 جاري إضافة", sampleAccounts.length, "حسابات...");

    const { data: insertedAccounts, error: insertError } = await supabase
      .from("patients")
      .insert(sampleAccounts)
      .select();

    if (insertError) {
      console.error("❌ خطأ في إضافة البيانات:", insertError);
      return NextResponse.json(
        { 
          error: "فشل في إضافة البيانات",
          details: insertError.message
        },
        { status: 500 }
      );
    }

    console.log("✅ تم إضافة:", insertedAccounts?.length || 0, "حسابات");

    return NextResponse.json({
      success: true,
      message: "تم إضافة البيانات التجريبية بنجاح",
      accountsAdded: insertedAccounts?.length || 0,
      accounts: insertedAccounts?.map((acc: any) => ({
        id: acc.id,
        name: acc.full_name,
        email: acc.email,
        type: acc.user_type,
      })),
    });
  } catch (error) {
    console.error("❌ خطأ:", error);
    return NextResponse.json(
      { 
        error: "حدث خطأ في الخادم",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // جلب الحسابات الموجودة
    const { data: accounts, error } = await supabase
      .from("patients")
      .select("id, full_name, email, user_type, is_active");

    if (error) {
      console.error("❌ خطأ في الجلب:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("📊 عدد الحسابات:", accounts?.length || 0);

    return NextResponse.json({
      success: true,
      totalAccounts: accounts?.length || 0,
      accounts: accounts || [],
    });
  } catch (error) {
    console.error("❌ خطأ:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
