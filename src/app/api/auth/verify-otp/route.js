// src/app/api/auth/verify-otp/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizePhone } from "@/lib/phone";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { phone: rawPhone, otp } = await req.json();
    const phone = normalizePhone(rawPhone);

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "phone and otp required" },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    const user = rows[0];

    if (!user.otp || !user.otpExpire || new Date() > new Date(user.otpExpire)) {
      return NextResponse.json(
        { success: false, message: "کد منقضی شده" },
        { status: 400 }
      );
    }

    if (String(user.otp) !== String(otp)) {
      return NextResponse.json(
        { success: false, message: "کد اشتباه است" },
        { status: 400 }
      );
    }

    // اگر slug موجود نیست و title هست، بساز
    let finalSlug = user.slug;
    if (!finalSlug && user.title) {
      finalSlug = user.title.trim().toLowerCase().replace(/\s+/g, "-");
      await db
        .update(users)
        .set({ slug: finalSlug })
        .where(eq(users.phone, phone));
    }

    // پاک کردن otp و otpExpire
    await db
      .update(users)
      .set({ otp: null, otpExpire: null })
      .where(eq(users.phone, phone));

    // ساخت JWT
    const payload = {
      id: user.id,
      phone: user.phone,
      role: user.role || "USER",
      slug: finalSlug || null,
    };

    const token = await signToken(payload, { expiresIn: "7d" });

    // تعیین مسیر ریدایرکت بر اساس نقش
    let redirectPath = "/client"; // پیش‌فرض برای USERها

    if (user.role === "OWNER" && finalSlug) {
      redirectPath = `/${finalSlug}/panel`;
    } else if (user.role === "ADMIN") {
      redirectPath = "/owner"; // یا هر مسیر دیگه برای ادمین
    }

    const res = NextResponse.json(
      {
        success: true,
        redirect: redirectPath,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          slug: finalSlug,
        },
      },
      { status: 200 }
    );

    // set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { success: false, message: "خطا" },
      { status: 500 }
    );
  }
}
