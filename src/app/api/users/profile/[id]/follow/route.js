// app/api/users/[id]/follow/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { follows } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفا وارد شوید",
        },
        { status: 401 }
      );
    }

    const targetId = Number(params.id);

    // بررسی وجود رابطه
    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(eq(follows.followerId, user.id), eq(follows.followingId, targetId))
      )
      .limit(1);

    if (existingFollow.length > 0) {
      // حذف فالو
      await db.delete(follows).where(eq(follows.id, existingFollow[0].id));

      return NextResponse.json({
        success: true,
        following: false,
      });
    } else {
      // اضافه کردن فالو
      await db.insert(follows).values({
        followerId: user.id,
        followingId: targetId,
      });

      return NextResponse.json({
        success: true,
        following: true,
      });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در عملیات" },
      { status: 500 }
    );
  }
}
