// src/app/api/tours/profile/route.js
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// اصلاحات:
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": "Bearer",
          },
        }
      );
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(token, SECRET));
    } catch (jwtError) {
      // 🔴 لاگ کردن خطای JWT
      console.warn("JWT verification failed:", jwtError.message);
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔴 Authorization Check
    if (payload.role !== "OWNER") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔴 Logging (برای مانیتورینگ)
    console.log(`Profile accessed by user ${payload.id}`);

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        slug: users.slug,
        phone: users.phone,
        role: users.role,
        verifyStatus: users.verifyStatus,
        avatar: users.avatar,
        createdAt: users.createdAt, // اضافه کردن
      })
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // 🔴 حذف اطلاعات حساس قبل از ارسال
    const safeUser = {
      ...user[0],
      // اگه فیلدهای حساس دیگه ای داری اینجا حذف کن
    };

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        timestamp: new Date().toISOString(), // برای دیباگ
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/tours/profile:", error);
    // 🔴 لاگ کردن خطا بدون نشون دادن جزئیات به کاربر
    return NextResponse.json(
      {
        success: false,
        message: "خطا در سرور",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
