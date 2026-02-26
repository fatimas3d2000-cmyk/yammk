import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Simple auth check
    const adminKey = process.env.ADMIN_SEED_KEY;
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: "غير مرخص" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      password,
      user_type = "patient",
      profile_picture,
    } = body;

    // Validation
    if (!full_name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "المستخدم موجود بالفعل" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user - try with different column names
    const insertData: any = {
      email,
      phone,
      password: hashedPassword,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Try full_name first, fallback to name
    if (full_name) {
      insertData.full_name = full_name;
    }

    if (user_type) {
      insertData.user_type = user_type;
    }

    if (profile_picture) {
      insertData.profile_picture = profile_picture;
    }

    // Insert user
    const { data, error } = await supabase
      .from("patients")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { 
          error: "حدث خطأ أثناء إضافة المستخدم",
          details: error.message,
          hint: "تحقق من أن جميع الأعمدة موجودة في جدول patients"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم إضافة المستخدم بنجاح",
        user: data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_SEED_KEY;
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: "غير مرخص" },
        { status: 401 }
      );
    }

    // Get all users
    const { data: users, error } = await supabase
      .from("patients")
      .select("id, full_name, email, phone, user_type, is_active, created_at");

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json(
        { error: "حدث خطأ أثناء جلب المستخدمين: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        users: users || [],
        count: users?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
