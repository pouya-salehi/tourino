// app/api/tours/[slug]/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const slug = decodeURIComponent(params.slug);

    // گرفتن تور
    const tourResults = await db
      .select()
      .from(tours)
      .where(eq(tours.slug, slug))
      .limit(1);

    if (tourResults.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "تور یافت نشد",
        },
        { status: 404 }
      );
    }

    const tour = tourResults[0];

    // گرفتن مالک تور
    let owner = null;
    if (tour.ownerId) {
      const ownerResults = await db
        .select({
          id: users.id,
          name: users.name,
          slug: users.slug,
          phone: users.phone,
          avatar: users.avatar,
          city: users.city,
          verifyStatus: users.verifyStatus,
        })
        .from(users)
        .where(eq(users.id, tour.ownerId))
        .limit(1);

      owner = ownerResults[0] || null;
    }

    return NextResponse.json({
      success: true,
      tour: {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        description: tour.description,
        price: tour.price,
        images: tour.images || [],
        startDate: tour.startDate,
        endDate: tour.endDate,
        maxPeople: tour.maxPeople,
        ownerId: tour.ownerId,
        createdAt: tour.createdAt,
        owner: owner,
        banner:
          Array.isArray(tour.images) && tour.images.length > 0
            ? tour.images[0]
            : null,
      },
    });
  } catch (error) {
    console.error("❌ Tour API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
  }
}
