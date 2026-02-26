import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    // Fetch providers (nurses/therapists/lab technicians)
    const { data: providers, error } = await supabase
      .from("patients")
      .select("*")
      .eq("user_type", "provider")
      .eq("is_active", true);

    if (error) {
      return NextResponse.json(
        { error: "حدث خطأ أثناء جلب المزودين" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        providers: providers || [],
        count: providers?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المزودين" },
      { status: 500 }
    );
  }
}
