// /app/api/tours/route.js - اصلاح شده
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { and, or, like, eq, gte, lte, desc, asc, sql } from "drizzle-orm";

/* ===============================
   Utils
================================ */

const ALLOWED_SORTS = {
  createdAt: tours.createdAt,
  title: tours.title,
  price: tours.price,
  startDate: tours.startDate,
};

function buildOrderBy(sortBy, sortOrder) {
  const column = ALLOWED_SORTS[sortBy] || tours.createdAt;
  return sortOrder === "asc" ? asc(column) : desc(column);
}

/* ===============================
   GET
================================ */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Params
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const ownerSlug = searchParams.get("ownerSlug") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      50
    );
    const offset = (page - 1) * limit;

    console.log("📊 GET /tours filters:", {
      search,
      status,
      ownerSlug,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    /* ===============================
       WHERE conditions
    ================================ */

    const whereConditions = [];

    // 🔍 Search
    if (search) {
      whereConditions.push(
        or(
          like(tours.title, `%${search}%`),
          like(tours.description, `%${search}%`),
          like(tours.location, `%${search}%`),
          like(tours.slug, `%${search}%`)
        )
      );
    }

    // 👤 Owner filter
    if (ownerSlug) {
      const [owner] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.slug, ownerSlug))
        .limit(1);

      if (owner) {
        whereConditions.push(eq(tours.ownerId, owner.id));
      }
    }

    // ⏱ Status filter
    const now = new Date();

    if (status === "active") {
      whereConditions.push(
        or(gte(tours.endDate, now), sql`${tours.endDate} IS NULL`)
      );
    }

    if (status === "expired") {
      whereConditions.push(lte(tours.endDate, now));
    }

    const finalWhere =
      whereConditions.length > 0 ? and(...whereConditions) : null;

    /* ===============================
       Main Query
    ================================ */

    let toursQuery = db
      .select({
        id: tours.id,
        title: tours.title,
        slug: tours.slug,
        description: tours.description, // اضافه کردن description
        price: tours.price,
        location: tours.location,
        startDate: tours.startDate,
        endDate: tours.endDate,
        maxPeople: tours.maxPeople,
        images: tours.images, // ✅ تصاویر
        enableComments: tours.enableComments,
        showLikes: tours.showLikes,
        showRating: tours.showRating,
        createdAt: tours.createdAt,
        owner: {
          id: users.id,
          name: users.name,
          slug: users.slug,
          phone: users.phone,
          avatar: users.avatar, // ✅ آواتار صاحب تور
          city: users.city,
          verifyStatus: users.verifyStatus,
        },
      })
      .from(tours)
      .leftJoin(users, eq(tours.ownerId, users.id));

    if (finalWhere) {
      toursQuery = toursQuery.where(finalWhere);
    }

    const data = await toursQuery
      .orderBy(buildOrderBy(sortBy, sortOrder))
      .limit(limit)
      .offset(offset);

    /* ===============================
       Count Query
    ================================ */

    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(tours)
      .leftJoin(users, eq(tours.ownerId, users.id));

    if (finalWhere) {
      countQuery = countQuery.where(finalWhere);
    }

    const [{ count }] = await countQuery;
    const totalCount = Number(count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    console.log(`✅ Tours fetched: ${data.length}/${totalCount}`);

    // لاگ برای دیباگ
    console.log("Sample tour data:", {
      hasImages: data[0]?.images?.length > 0,
      imageUrl: data[0]?.images?.[0],
      ownerAvatar: data[0]?.owner?.avatar,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        search,
        status,
        ownerSlug,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("❌ GET tours error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت لیست تورها",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
