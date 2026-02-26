import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

// Get table column info using SQL directly
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

    console.log("🔍 Getting table information via SQL...");

    // Use rpc to run a query 
    const { data: columns, error } = await supabase.rpc('get_table_info', {
      table_name: 'patients'
    }).single();

    if (error && error.code !== 'PGRST116') {
      console.log("RPC not available, trying direct query...");
    }

    // Fallback: Try with SQL directly
    const { data: sqlResult, error: sqlError } = await supabase
      .rpc('query_string', {
        query: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'patients' ORDER BY ordinal_position`
      })
      .single();

    if (sqlError) {
      console.log("SQL query not available either, trying sample data method...");
    }

    // Last resort: Try fetching one row with different column names
    console.log("Trying common column names...");
    
    const commonColumns = [
      "id",
      "created_at",
      "updated_at",
      "email",
      "password_hash",
      "full_name",
      "phone",
      "profile_picture",
      "user_type",
      "is_active",
      "bio",
      "address",
      "city",
      "specialization",
      "experience",
      "rating"
    ];

    const testQuery = commonColumns.join(", ");
    const { data: testData, error: testError } = await supabase
      .from("patients")
      .select(testQuery)
      .limit(1);

    if (testError) {
      console.error("Test query error:", testError);
      
      // Try to extract which columns failed
      const errorMsg = testError.message || "";
      const missingColumns = commonColumns.filter(col => 
        errorMsg.includes(`"${col}"`) || errorMsg.includes(`${col}`)
      );
      
      const availableColumns = commonColumns.filter(col => !missingColumns.includes(col));

      return NextResponse.json(
        {
          success: false,
          message: "بعض الأعمدة غير موجودة",
          testedColumns: commonColumns,
          error: testError.message,
          likelyMissing: missingColumns,
          likelyAvailable: availableColumns,
          hint: "استخدم الأعمدة المتاحة فقط"
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم العثور على جميع الأعمدة",
        availableColumns: commonColumns,
        sampleData: testData
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
