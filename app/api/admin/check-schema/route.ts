import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

// Check table schema by querying INFORMATION_SCHEMA
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

    console.log("🔍 Checking schema...");
    console.log("Supabase URL:", supabaseUrl);
    console.log("Has service role key:", !!serviceRoleKey);

    // Method 1: Try to fetch from patients with minimal select
    console.log("📋 Method 1: Trying to fetch patients with *");
    const { data: allData, error: allError } = await supabase
      .from("patients")
      .select("*", { count: "exact" })
      .limit(1);

    if (allError) {
      console.error("❌ Error fetching *:", allError);
      
      // Try with specific columns
      console.log("📋 Method 2: Trying to fetch with specific columns");
      const { data: specificData, error: specificError } = await supabase
        .from("patients")
        .select("id, email")
        .limit(1);

      if (specificError) {
        console.error("❌ Error with specific columns:", specificError);
        return NextResponse.json(
          {
            success: false,
            users: [],
            count: 0,
            structure: [],
            error: "لا يمكن الوصول إلى جدول patients",
            details: allError.message,
            hint: "تحقق من RLS policies وأذونات جدول patients",
            specificError: specificError.message,
          },
          { status: 500 }
        );
      }

      // If we got here, id and email work
      console.log("✅ id and email columns exist");
      return NextResponse.json(
        {
          success: true,
          users: specificData || [],
          count: specificData?.length || 0,
          structure: ["id", "email"],
          message: "جدول patients يحتوي على الأعمدة: id, email",
          hint: "جرب استخدام الأعمدة الأساسية فقط",
        },
        { status: 200 }
      );
    }

    // Get structure from the fetched data
    const structure = allData && allData.length > 0 ? Object.keys(allData[0]) : [];
    console.log("✅ Found columns:", structure);

    return NextResponse.json(
      {
        success: true,
        users: allData || [],
        count: allData?.length || 0,
        structure: structure,
        message: `جدول patients يحتوي على الأعمدة التالية: ${structure.join(", ")}`,
        rowCount: (allData?.length || 0),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Catch Error:", error);
    return NextResponse.json(
      { 
        error: "خطأ في الخادم",
        details: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}
