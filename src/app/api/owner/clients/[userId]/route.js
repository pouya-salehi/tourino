// app/api/owner/clients/[userId]/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, verificationDocuments, bookings, tours } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req, { params }) {
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

    if (!["OWNER", "ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // ================= پارامترها =================
    const { userId } = await params;

    // ================= بررسی دسترسی OWNER =================
    if (payload.role === "OWNER") {
      // بررسی که این مشتری در تورهای این صاحب تور رزرو داشته
      const hasAccess = await db
        .select({ count: sql`COUNT(*)` })
        .from(bookings)
        .innerJoin(tours, eq(tours.id, bookings.tourId))
        .where(and(eq(bookings.userId, userId), eq(tours.ownerId, payload.id)));

      if (parseInt(hasAccess[0]?.count || 0) === 0) {
        return NextResponse.json(
          { success: false, message: "دسترسی به این کاربر ندارید" },
          { status: 403 }
        );
      }
    }

    // ================= گرفتن اطلاعات کاربر =================
    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        nationalCode: users.nationalCode,
        avatar: users.avatar,
        verifyStatus: users.verifyStatus,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        gender: users.gender,
        birthDate: users.birthDate,
        address: users.address,
        emergencyContact: users.emergencyContact,
        preferences: users.preferences,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // ================= گرفتن مدارک =================
    const documents = await db
      .select({
        id: verificationDocuments.id,
        licenseImage: verificationDocuments.licenseImage,
        nationalCard: verificationDocuments.nationalCard,
        signedContract: verificationDocuments.signedContract,
        additionalDocs: verificationDocuments.additionalDocs,
        status: verificationDocuments.status,
        adminNote: verificationDocuments.adminNote,
        reviewedAt: verificationDocuments.reviewedAt,
        reviewedBy: verificationDocuments.reviewedBy,
        createdAt: verificationDocuments.createdAt,
      })
      .from(verificationDocuments)
      .where(eq(verificationDocuments.userId, userId))
      .orderBy(desc(verificationDocuments.createdAt));

    // ================= گرفتن تورهای رزرو شده =================
    const bookingsData = await db
      .select({
        id: bookings.id,
        tourId: bookings.tourId,
        tourName: tours.title,
        bookingDate: bookings.createdAt,
        status: bookings.status,
        totalPrice: bookings.totalPrice,
        participantsCount: bookings.participantsCount,
        specialRequests: bookings.specialRequests,
      })
      .from(bookings)
      .innerJoin(tours, eq(tours.id, bookings.tourId))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));

    // ================= آمار =================
    const stats = {
      totalBookings: bookingsData.length,
      completedBookings: bookingsData.filter((b) => b.status === "COMPLETED")
        .length,
      cancelledBookings: bookingsData.filter((b) => b.status === "CANCELLED")
        .length,
      totalSpent: bookingsData.reduce(
        (sum, b) => sum + (parseFloat(b.totalPrice) || 0),
        0
      ),
      verificationAttempts: documents.length,
    };

    // ================= پاسخ =================
    return NextResponse.json({
      success: true,
      data: {
        user: userData[0],
        documents,
        bookings: bookingsData,
        stats,
      },
    });
  } catch (error) {
    console.error("API Error - /api/owner/clients/[userId]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
  }
}
