import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

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

    // Test different password column names
    const passwordColumnNames = ["password", "password_hash", "pwd", "pass", "hashed_password"];
    let foundPasswordColumn = null;
    let availableColumns = [];

    for (const pwdCol of passwordColumnNames) {
      const { data, error } = await supabase
        .from("patients")
        .select(`id, email, ${pwdCol}`)
        .limit(1);

      if (!error) {
        foundPasswordColumn = pwdCol;
        console.log(`✅ Found password column: ${pwdCol}`);
        break;
      }
    }

    // Get actual available columns
    const { data: testData, error: testError } = await supabase
      .from("patients")
      .select("id, email, full_name, phone, user_type, is_active, created_at")
      .limit(0); // Get 0 rows but still get column info

    if (!testError && testData !== null) {
      // The query succeeded, so these columns exist
      availableColumns = ["id", "email", "full_name", "phone", "user_type", "is_active", "created_at"];
    }

    return NextResponse.json(
      {
        success: true,
        passwordColumn: foundPasswordColumn || "NOT FOUND",
        availableColumns: availableColumns.length > 0 ? availableColumns : ["id", "email", "full_name", "phone", "user_type", "is_active"],
        testedPasswordNames: passwordColumnNames,
        message: foundPasswordColumn ? `استخدم العمود: ${foundPasswordColumn}` : "لم يتم العثور على عمود كلمة المرور"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { 
        error: "خطأ في الخادم",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
