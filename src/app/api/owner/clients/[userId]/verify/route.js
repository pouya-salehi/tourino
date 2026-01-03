// app/api/owner/clients/[userId]/verify/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, verificationDocuments, verificationLogs } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req, { params }) {
  try {
    // ================= احراز هویت =================
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    let payload;
    try {
      const { payload: decoded } = await jwtVerify(token, SECRET);
      payload = decoded;
    } catch {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر" },
        { status: 401 }
      );
    }

    if (payload.role !== "OWNER") {
      return NextResponse.json(
        { success: false, message: "فقط صاحب تور مجاز است" },
        { status: 403 }
      );
    }

    // ================= پارامترها =================
    const { userId } = await params;
    const body = await req.json();
    const { action, note } = body; // action: 'approve' یا 'reject'

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "عملیات نامعتبر" },
        { status: 400 }
      );
    }

    if (action === "reject" && (!note || note.trim().length < 10)) {
      return NextResponse.json(
        {
          success: false,
          message: "برای رد کردن باید دلیل کافی وارد کنید (حداقل ۱۰ کاراکتر)",
        },
        { status: 400 }
      );
    }

    // ================= بررسی کاربر =================
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // ================= بررسی مدارک =================
    const latestDoc = await db
      .select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.userId, userId))
      .orderBy(desc(verificationDocuments.createdAt))
      .limit(1);

    if (latestDoc.length === 0) {
      return NextResponse.json(
        { success: false, message: "مدارکی برای بررسی یافت نشد" },
        { status: 400 }
      );
    }

    // ================= تغییر وضعیت =================
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    // آپدیت وضعیت کاربر
    await db
      .update(users)
      .set({
        verifyStatus: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // آپدیت وضعیت مدارک
    await db
      .update(verificationDocuments)
      .set({
        status: newStatus,
        reviewedAt: new Date(),
        reviewedBy: payload.id,
        adminNote: action === "reject" ? note : null,
      })
      .where(eq(verificationDocuments.id, latestDoc[0].id));

    // ایجاد لاگ
    await db.insert(verificationLogs).values({
      userId,
      action: newStatus,
      performedBy: payload.id,
      note: action === "reject" ? note : "مدارک با موفقیت تایید شدند",
      documentId: latestDoc[0].id,
    });

    // ================= پاسخ =================
    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "مدارک با موفقیت تایید شد"
          : "مدارک با موفقیت رد شد",
      data: {
        userId,
        newStatus,
        reviewedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API Error - /api/owner/clients/[userId]/verify:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
  }
}
