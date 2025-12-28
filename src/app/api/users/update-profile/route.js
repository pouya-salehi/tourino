// app/api/users/update-profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, phone, city } = body;

    // Find user
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Update user
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;

    await db.update(users).set(updateData).where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: "پروفایل با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("❌ PATCH /users/update-profile error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در به‌روزرسانی پروفایل" },
      { status: 500 }
    );
  }
}
