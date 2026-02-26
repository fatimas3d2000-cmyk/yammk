import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Try to fetch the first patient to verify connection
    const { data, error, status } = await supabase
      .from("patients")
      .select("count", { count: "exact" });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "✅ اتصالك بـ Supabase يعمل بنجاح!",
        totalPatients: data?.length || 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Connection test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء اختبار الاتصال",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
