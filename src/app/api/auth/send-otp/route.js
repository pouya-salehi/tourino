// src/app/api/auth/send-otp/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

function makeSlug(title = "") {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req) {
  try {
    const { phone, name, title } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "شماره موبایل لازم است" },
        { status: 400 }
      );
    }

    // همه کاربران جدید به صورت پیش‌فرض USER هستند
    // فقط ADMIN می‌تواند کاربران OWNER ایجاد کند
    const role = "USER"; // 👈 همه کاربران جدید USER هستند

    let slug = null;
    if (title) {
      slug = makeSlug(title);
      // بررسی یکتایی slug
      const exists = await db
        .select()
        .from(users)
        .where(eq(users.slug, slug))
        .limit(1);
      if (exists.length > 0) {
        return NextResponse.json(
          { success: false, message: "این عنوان قبلاً رزرو شده" },
          { status: 409 }
        );
      }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpire = new Date(Date.now() + 2 * 60 * 1000);

    // آیا کاربر قبلا وجود داشته؟
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({
        phone,
        name: name || null,
        title: title || null,
        slug,
        role: role, // 👈 همیشه USER
        otp,
        otpExpire,
      });
    } else {
      // اگر کاربر وجود دارد، فقط OTP رو آپدیت کن
      await db
        .update(users)
        .set({
          otp,
          otpExpire,
          name: name || existing[0].name,
          title: title || existing[0].title,
          slug: slug || existing[0].slug,
        })
        .where(eq(users.phone, phone));
    }

    // بقیه کد ارسال پیامک بدون تغییر...
    const apiKey = process.env.KAVENEGAR_API_KEY;
    if (!apiKey || process.env.NODE_ENV !== "production") {
      console.log("Your OTP:", otp);
      return NextResponse.json({
        success: true,
        message: "OTP generated (dev mode)",
      });
    }

    const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phone}&token=${otp}&template=cooperify`;
    const smsRes = await fetch(url);
    const smsJson = await smsRes.json();
    console.log("SMS Response:", smsJson);

    if (!smsRes.ok || smsJson.return?.status !== 200) {
      console.error("SMS failed:", smsJson);
      return NextResponse.json(
        {
          success: false,
          message: smsJson.return?.message || "خطا در ارسال پیامک",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "پیامک ارسال شد" });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
