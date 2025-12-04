import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({
      status: "success",
      message: "خروج با موفقیت انجام شد",
    });

    // پاک کردن کوکی توکن
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // انقضا در گذشته
    });

    return res;
  } catch (err) {
    console.error("logout error:", err);
    return NextResponse.json(
      { status: "failed", message: "خطا در خروج" },
      { status: 500 }
    );
  }
}
