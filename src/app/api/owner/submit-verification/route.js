// app/api/owner/submit-verification/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, verificationDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    // احراز هویت
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

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

    // فقط OWNER می‌تواند مدارک ارسال کند
    if (payload.role !== "OWNER") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // گرفتن FormData
    const formData = await req.formData();
    const slug = formData.get("slug");
    const signedContract = formData.get("signedContract");
    const additionalDocs = formData.getAll("additionalDocs");

    // چک کردن اینکه کاربر مالک این slug هست
    if (payload.slug !== slug) {
      return NextResponse.json(
        { success: false, message: "دسترسی به این پروفایل ندارید" },
        { status: 403 }
      );
    }

    // در اینجا باید فایل‌ها رو آپلود کنی
    // فعلاً فقط رکورد ایجاد می‌کنیم
    const user = await db
      .select()
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // ایجاد رکورد مدارک
    await db.insert(verificationDocuments).values({
      ownerId: user[0].id,
      licenseImage: "pending", // بعداً آپلود واقعی
      nationalCard: "pending", // بعداً آپلود واقعی
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      message: "مدارک با موفقیت ارسال شد",
    });
  } catch (error) {
    console.error("submit-verification error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
