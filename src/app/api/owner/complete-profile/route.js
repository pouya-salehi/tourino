// app/api/owner/complete-profile/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    // گرفتن توکن از کوکی
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // وریفای کردن توکن
    let payload;
    try {
      const { payload: verified } = await jwtVerify(token, SECRET);
      payload = verified;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر" },
        { status: 401 }
      );
    }

    // چک کردن نقش کاربر
    if (payload.role !== "OWNER" && payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // گرفتن داده‌ها
    const { slug, nationalCode, licenseNumber, fullName, phone } =
      await req.json();

    // چک کردن اینکه کاربر مالک این slug هست
    if (payload.role === "OWNER" && payload.slug !== slug) {
      return NextResponse.json(
        { success: false, message: "دسترسی به این پروفایل ندارید" },
        { status: 403 }
      );
    }

    // آپدیت کاربر
    await db
      .update(users)
      .set({
        name: fullName,
        phone: phone || undefined,
        nationalCode,
        licenseNumber,
        profileCompleted: true,
      })
      .where(eq(users.slug, slug));

    return NextResponse.json({
      success: true,
      message: "اطلاعات با موفقیت ذخیره شد",
    });
  } catch (error) {
    console.error("complete-profile error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
