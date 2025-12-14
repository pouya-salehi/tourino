// app/api/users/[slug]/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, tours } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const slug = params.slug;

    // گرفتن کاربر
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    if (userResults.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر یافت نشد",
        },
        { status: 404 }
      );
    }

    const user = userResults[0];

    // گرفتن تورهای این کاربر
    const userTours = await db
      .select()
      .from(tours)
      .where(eq(tours.ownerId, user.id));

    // فرمت کردن تاریخ
    const joinDate = new Date(user.createdAt).toLocaleDateString("fa-IR");

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        slug: user.slug,
        title: user.title,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        bio: user.bio,
        role: user.role,
        verifyStatus: user.verifyStatus,
        profileCompleted: user.profileCompleted,
        nationalCode: user.nationalCode,
        licenseNumber: user.licenseNumber,

        // برای نمایش در کامپوننت
        isVerified: user.verifyStatus === "APPROVED",
        isPending: user.verifyStatus === "PENDING",
        isOwner: user.role === "OWNER",
        initials: (user.name || user.slug || "U").charAt(0),
        joinDate: joinDate,
      },
      tours: userTours.map((tour) => ({
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        description: tour.description,
        price: tour.price,
        images: tour.images || [],
        startDate: tour.startDate,
        endDate: tour.endDate,
        maxPeople: tour.maxPeople,
        createdAt: tour.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ User API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
  }
}
