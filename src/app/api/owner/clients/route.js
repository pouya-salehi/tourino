import { NextResponse } from "next/server";
import db from "@/db";
import { users, tours, bookings } from "@/db/schema";
import { eq, sql, and, or, like, inArray } from "drizzle-orm";
import { getUserFromCookies } from "@/lib/auth";

export async function GET(request) {
  try {
    const currentUser = await getUserFromCookies();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const verifyStatus = searchParams.get("verifyStatus");
    const sortBy = searchParams.get("sort") || "newest";
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
    const offset = (page - 1) * limit;

    // ================= OWNER clientIds (اختیاری) =================
    let clientIds = [];

    if (currentUser.role === "OWNER") {
      const ownerTours = await db
        .select({ id: tours.id })
        .from(tours)
        .where(eq(tours.ownerId, currentUser.id));

      if (ownerTours.length) {
        const tourIds = ownerTours.map((t) => t.id);

        const bookingsResult = await db
          .select({ userId: bookings.userId })
          .from(bookings)
          .where(inArray(bookings.tourId, tourIds))
          .groupBy(bookings.userId);

        clientIds = bookingsResult.map((b) => b.userId);
      }
    }

    // ================= Filters =================
    const filters = [];

    // فقط وقتی booking وجود داره فیلتر کن
    if (currentUser.role === "OWNER" && clientIds.length > 0) {
      filters.push(inArray(users.id, clientIds));
    }

    if (search) {
      const q = `%${search}%`;
      filters.push(
        or(
          like(users.name, q),
          like(users.phone, q),
          like(users.slug, q),
          like(users.nationalCode, q)
        )
      );
    }

    if (verifyStatus && verifyStatus !== "all") {
      filters.push(eq(users.verifyStatus, verifyStatus));
    }

    const where = filters.length ? and(...filters) : undefined;

    // ================= Sort =================
    const orderMap = {
      newest: sql`${users.createdAt} DESC`,
      oldest: sql`${users.createdAt} ASC`,
      name_asc: sql`${users.name} ASC`,
      name_desc: sql`${users.name} DESC`,
    };

    // ================= Data =================
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        slug: users.slug,
        phone: users.phone,
        avatar: users.avatar,
        city: users.city,
        bio: users.bio,
        verifyStatus: users.verifyStatus,
        profileCompleted: users.profileCompleted,
        createdAt: users.createdAt,
        bookingCount: sql`(
          SELECT COUNT(*) FROM ${bookings}
          WHERE ${bookings.userId} = ${users.id}
        )`.as("booking_count"),
      })
      .from(users)
      .where(where)
      .orderBy(orderMap[sortBy])
      .limit(limit)
      .offset(offset);

    const totalRes = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(where);

    const statsRes = await db
      .select({
        total: sql`COUNT(*)`,
        verified: sql`COUNT(CASE WHEN ${users.verifyStatus}='APPROVED' THEN 1 END)`,
        pending: sql`COUNT(CASE WHEN ${users.verifyStatus}='PENDING' THEN 1 END)`,
        rejected: sql`COUNT(CASE WHEN ${users.verifyStatus}='REJECTED' THEN 1 END)`,
      })
      .from(users)
      .where(where);

    return NextResponse.json({
      success: true,
      data: rows.map((u) => ({
        ...u,
        bookingCount: Number(u.bookingCount || 0),
        isVerified: u.verifyStatus === "APPROVED",
      })),
      meta: {
        pagination: {
          page,
          limit,
          total: Number(totalRes[0].count),
          totalPages: Math.ceil(totalRes[0].count / limit),
        },
        stats: statsRes[0],
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}
