import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "رمز Google مطلوب" },
        { status: 400 }
      );
    }

    // In production, verify the token with Google's API
    // For now, just return a mock response
    const googleUser = {
      id: Date.now().toString(),
      email: "user@gmail.com",
      fullName: "Google User",
      loginType: "google",
      lastLogin: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        user: googleUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "فشل التحقق من حساب Google" },
      { status: 500 }
    );
  }
}
