import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    // Fetch services from Supabase
    const { data: services, error } = await supabase
      .from("service_catalog")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: "حدث خطأ أثناء جلب الخدمات" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        services: services || [],
        count: services?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات" },
      { status: 500 }
    );
  }
}
