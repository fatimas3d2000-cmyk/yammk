import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_SEED_KEY;
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: "غير مرخص" },
        { status: 401 }
      );
    }

    console.log("🔄 Starting migration...");

    // Run migrations for patients table columns
    const migrationsSQL = [
      // Add password column
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS password TEXT;`,
      
      // Add missing columns
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'patient';`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS profile_picture TEXT;`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS bio TEXT;`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS specialization TEXT;`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS experience INTEGER;`,
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2);`,
      
      // Add full_name column
      `ALTER TABLE patients ADD COLUMN IF NOT EXISTS full_name TEXT;`,
    ];

    // Execute each migration
    const results = [];
    for (const sql of migrationsSQL) {
      try {
        console.log(`Running: ${sql.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql });
        
        if (error) {
          console.warn(`⚠️ Migration warning: ${error.message}`);
          results.push({
            sql: sql.substring(0, 50),
            success: false,
            error: error.message,
          });
        } else {
          console.log(`✅ Migration successful`);
          results.push({
            sql: sql.substring(0, 50),
            success: true,
          });
        }
      } catch (e) {
        console.error(`❌ Error running migration:`, e);
        results.push({
          sql: sql.substring(0, 50),
          success: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    // Copy name to full_name if needed
    try {
      console.log("Copying name to full_name...");
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `UPDATE patients SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;` 
      });
      
      if (!error) {
        console.log("✅ Data copied successfully");
      }
    } catch (e) {
      console.log("⚠️ Could not copy data:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تنفيذ الـ migrations",
        results: results,
        hint: "الآن يجب أن تعمل إضافة المستخدمين بدون مشاكل"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Migration Error:", error);
    return NextResponse.json(
      { 
        error: "خطأ في الـ migration",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
