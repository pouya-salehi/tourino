// app/api/tours/filter/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import {
  and,
  or,
  eq,
  gte,
  lte,
  desc,
  asc,
  sql,
  ilike,
  isNotNull,
} from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse filters
    const filters = {
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : null,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : null,
      sortBy: searchParams.get("sortBy") || "newest",
      ownerVerified: searchParams.get("ownerVerified") === "true",
      page: Math.max(Number(searchParams.get("page")) || 1, 1),
      limit: 12,
    };

    // Build WHERE conditions
    const whereConditions = [];

    if (filters.search) {
      whereConditions.push(
        or(
          ilike(tours.title, `%${filters.search}%`),
          ilike(tours.description, `%${filters.search}%`),
          ilike(users.name, `%${filters.search}%`),
          ilike(users.slug, `%${filters.search}%`)
        )
      );
    }

    if (filters.location) {
      whereConditions.push(
        or(
          ilike(tours.location, `%${filters.location}%`),
          ilike(users.city, `%${filters.location}%`)
        )
      );
    }

    if (filters.minPrice !== null) {
      whereConditions.push(gte(tours.price, filters.minPrice));
    }

    if (filters.maxPrice !== null) {
      whereConditions.push(lte(tours.price, filters.maxPrice));
    }

    if (filters.ownerVerified) {
      whereConditions.push(eq(users.verifyStatus, "APPROVED"));
    }

    const where =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Calculate total count
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(tours)
      .leftJoin(users, eq(tours.ownerId, users.id))
      .where(where || sql`1=1`);

    const totalCount = Number(count);
    const totalPages = Math.ceil(totalCount / filters.limit);

    // Build ORDER BY
    let orderBy;
    switch (filters.sortBy) {
      case "cheapest":
        orderBy = asc(tours.price);
        break;
      case "expensive":
        orderBy = desc(tours.price);
        break;
      case "rating":
        orderBy = desc(sql`(
          SELECT COALESCE(AVG(rating), 0) 
          FROM reviews 
          WHERE tour_id = tours.id
        )`);
        break;
      default: // newest
        orderBy = desc(tours.createdAt);
    }

    // Fetch data
    const data = await db
      .select({
        id: tours.id,
        title: tours.title,
        slug: tours.slug,
        description: tours.description,
        price: tours.price,
        location: tours.location,
        images: tours.images,
        startDate: tours.startDate,
        endDate: tours.endDate,
        maxPeople: tours.maxPeople,
        createdAt: tours.createdAt,
        rating:
          sql <
          number >
          `(
          SELECT COALESCE(AVG(rating), 0) 
          FROM reviews 
          WHERE tour_id = ${tours.id}
        )`.as("rating"),
        owner: {
          id: users.id,
          name: users.name,
          slug: users.slug,
          avatar: users.avatar,
          city: users.city,
          verifyStatus: users.verifyStatus,
        },
      })
      .from(tours)
      .leftJoin(users, eq(tours.ownerId, users.id))
      .where(where || sql`1=1`)
      .orderBy(orderBy)
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        pagination: {
          page: filters.page,
          limit: filters.limit,
          totalCount,
          totalPages,
          hasNext: filters.page < totalPages,
          hasPrev: filters.page > 1,
        },
        filters,
      },
    });
  } catch (error) {
    console.error("❌ Filter API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در فیلتر تورها",
      },
      { status: 500 }
    );
  }
}
