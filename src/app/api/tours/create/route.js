// /app/api/tours/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    console.log("🚀 Creating new tour...");

    // دریافت داده‌ها
    const body = await request.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));

    // استخراج فیلدها
    const {
      title,
      ownerSlug, // ما ownerSlug دریافت می‌کنیم
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

    // اعتبارسنجی فیلدهای ضروری
    if (!title || !ownerSlug || !description || !price || !location) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { success: false, message: "فیلدهای ضروری را پر کنید" },
        { status: 400 }
      );
    }

    // 🔍 پیدا کردن ownerId از روی ownerSlug
    console.log("🔍 Finding owner by slug:", ownerSlug);

    const ownerResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.slug, ownerSlug))
      .limit(1);

    if (!ownerResult || ownerResult.length === 0) {
      console.error("❌ Owner not found for slug:", ownerSlug);
      return NextResponse.json(
        { success: false, message: "مالک تور یافت نشد" },
        { status: 404 }
      );
    }

    const ownerId = ownerResult[0].id;
    console.log("✅ Owner ID found:", ownerId);

    // تبدیل schedule به آرایه متن (اگر object است)
    let formattedSchedule = [];
    if (Array.isArray(schedule)) {
      formattedSchedule = schedule.map((day) => {
        if (typeof day === "object") {
          return JSON.stringify(day); // یا format دلخواه
        }
        return day;
      });
    }

    // تبدیل images به آرایه معتبر
    let formattedImages = [];
    if (Array.isArray(images)) {
      formattedImages = images
        .map((img) => {
          // اگر object است و preview دارد، از preview استفاده کن
          if (img && typeof img === "object" && img.preview) {
            return img.preview;
          }
          // اگر string است
          if (typeof img === "string") {
            return img;
          }
          return "";
        })
        .filter((img) => img);
    }

    // ایجاد slug اگر وجود ندارد
    const finalSlug =
      seoSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();

    console.log("📝 Preparing tour data for insert...");

    // 🧾 ایجاد تور جدید
    try {
      const [tour] = await db
        .insert(tours)
        .values({
          ownerId, // ✅ حالا ownerId داریم
          title,
          slug: finalSlug,
          description,
          price: parseInt(price),
          maxPeople: maxPeople ? parseInt(maxPeople) : null,
          images: formattedImages,
          location,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          features: Array.isArray(features) ? features : [],
          includes: Array.isArray(includes) ? includes : [],
          excludes: Array.isArray(excludes) ? excludes : [],
          schedule: formattedSchedule,
          faqs: Array.isArray(faqs) ? faqs : [],
          enableComments,
          showLikes,
          showRating,
          metaTitle,
          metaDescription,
          metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
        })
        .returning();

      console.log("✅ Tour created successfully:", tour.id);

      return NextResponse.json({
        success: true,
        message: "تور با موفقیت ایجاد شد",
        tour,
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError);

      // خطای دقیق‌تر
      if (dbError.message?.includes("unique constraint")) {
        return NextResponse.json(
          { success: false, message: "اسلاگ تکراری است" },
          { status: 400 }
        );
      }

      if (dbError.message?.includes("foreign key constraint")) {
        return NextResponse.json(
          { success: false, message: "مالک معتبر نیست" },
          { status: 400 }
        );
      }

      throw dbError;
    }
  } catch (error) {
    console.error("❌ POST tour error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد تور",
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
