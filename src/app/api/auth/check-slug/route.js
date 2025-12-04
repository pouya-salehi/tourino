// src/app/api/auth/check-slug/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { title } = await req.json();
    if (!title)
      return NextResponse.json(
        { available: false, message: "عنوان ارسال نشده" },
        { status: 400 }
      );

    // **تغییر این خط** - هماهنگ با send-otp
    const slug = title.toLowerCase().replace(/\s+/g, ""); // بدون -

    console.log("🔍 Checking slug:", slug, "for title:", title);

    const found = await db
      .select()
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    console.log("📊 Found users:", found.length);

    if (found.length > 0) {
      return NextResponse.json({
        available: false,
        slug,
        message: "این عنوان قبلا ثبت شده",
      });
    }

    return NextResponse.json({
      available: true,
      slug,
      message: "عنوان قابل استفاده است",
    });
  } catch (err) {
    console.error("check-slug error:", err);
    return NextResponse.json(
      { available: false, message: "خطا در بررسی" },
      { status: 500 }
    );
  }
}
