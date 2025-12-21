//app/api/tours/create
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    // ✅ دریافت body
    const body = await request.json();

    const {
      title,
      ownerSlug,
      description,
      price,
      maxPeople,
      location,
      features = [],
      includes = [],
      excludes = [],
      schedule = [],
      faqs = [],
      enableComments = true,
      showLikes = true,
      showRating = true,
      metaTitle = "",
      metaDescription = "",
      metaKeywords = [],
      seoSlug,
      images = [],
      startDate,
      endDate,
    } = body;

    // ❗ اعتبارسنجی
    if (!title || !ownerSlug || !description || !price || !location) {
      return NextResponse.json(
        { success: false, message: "فیلدهای ضروری را پر کنید" },
        { status: 400 }
      );
    }

    // 🔍 پیدا کردن ownerId
    const ownerResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.slug, ownerSlug))
      .limit(1);

    if (!ownerResult.length) {
      return NextResponse.json(
        { success: false, message: "مالک تور یافت نشد" },
        { status: 404 }
      );
    }

    const ownerId = ownerResult[0].id;

    // ✅ schedule → string
    const formattedSchedule = Array.isArray(schedule)
      ? schedule.map((day) =>
          typeof day === "object" ? JSON.stringify(day) : day
        )
      : [];

    // ✅ images → فیلتر کردن URLهای معتبر (HTTP, HTTPS یا مسیرهای نسبی)
    const formattedImages = Array.isArray(images)
      ? images
          .map((img) => {
            if (typeof img !== "string") return null;
            // قبول کردن:
            // 1. URLهای کامل (http://, https://)
            // 2. مسیرهای نسبی (/uploads/...)
            // 3. داده‌های base64 (data:image/...)
            if (
              img.startsWith("http://") ||
              img.startsWith("https://") ||
              img.startsWith("/") ||
              img.startsWith("data:image/")
            ) {
              return img;
            }
            return null;
          })
          .filter(Boolean) // حذف nullها
      : [];

    // ✅ slug
    const finalSlug =
      seoSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    // 🧾 insert
    const [tour] = await db
      .insert(tours)
      .values({
        ownerId,
        title,
        slug: finalSlug,
        description,
        price: Number(price),
        maxPeople: maxPeople ? Number(maxPeople) : null,
        images: formattedImages,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        features,
        includes,
        excludes,
        schedule: formattedSchedule,
        faqs,
        enableComments,
        showLikes,
        showRating,
        metaTitle,
        metaDescription,
        metaKeywords,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تور با موفقیت ایجاد شد",
      tour,
    });
  } catch (error) {
    console.error("❌ POST tour error:", error);

    // خطاهای دیتابیس
    if (error.code === "23505") {
      // PostgreSQL unique violation
      return NextResponse.json(
        { success: false, message: "اسلاگ تکراری است" },
        { status: 400 }
      );
    }

    if (error.message?.includes("foreign key constraint")) {
      return NextResponse.json(
        { success: false, message: "مالک معتبر نیست" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد تور",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
