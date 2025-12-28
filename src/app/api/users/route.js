// app/api/users/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, follows, tours } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getUserFromCookies();

    // گرفتن کاربران + تعداد تورها
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        slug: users.slug,
        avatar: users.avatar,
        city: users.city,
        bio: users.bio,
        role: users.role,
        verifyStatus: users.verifyStatus,
        // تعداد تورها (پست‌ها)
        tourCount: sql`(
          SELECT COUNT(*) 
          FROM ${tours} 
          WHERE ${tours.ownerId} = ${users.id}
        )`.as("tour_count"),
      })
      .from(users)
      .where(eq(users.role, "OWNER"));

    let followingIds = [];

    // گرفتن لیست فالوها اگر کاربر لاگین کرده
    if (currentUser) {
      const followData = await db
        .select({ followingId: follows.followingId })
        .from(follows)
        .where(eq(follows.followerId, currentUser.id));

      followingIds = followData.map((f) => f.followingId);
    }

    // گرفتن تعداد فالوورها و فالوینگ برای هر کاربر
    const usersWithFollowStats = await Promise.all(
      rows.map(async (user) => {
        const [followers, following] = await Promise.all([
          // تعداد فالوورها
          db
            .select({ count: sql`COUNT(*)` })
            .from(follows)
            .where(eq(follows.followingId, user.id))
            .then((res) => Number(res[0]?.count || 0)),

          // تعداد فالوینگ
          db
            .select({ count: sql`COUNT(*)` })
            .from(follows)
            .where(eq(follows.followerId, user.id))
            .then((res) => Number(res[0]?.count || 0)),
        ]);

        return {
          ...user,
          isVerified: user.verifyStatus === "APPROVED",
          isFollowing: followingIds.includes(user.id),
          isCurrentUser: currentUser?.id === user.id, // ✅ افزودن این فیلد
          stats: {
            followers,
            following,
            tours: user.tourCount,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: usersWithFollowStats,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت پروفایل‌ها" },
      { status: 500 }
    );
  }
}
