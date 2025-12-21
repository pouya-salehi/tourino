//app/api/tours/create/[id]/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

// GET - دریافت یک تور خاص
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه تور معتبر نیست" },
        { status: 400 }
      );
    }
    const tourId = parseInt(id);
    // دریافت تور با اطلاعات مالک
    const tour = await db
      .select({
        id: tours.id,
        title: tours.title,
        slug: tours.slug,
        description: tours.description,
        price: tours.price,
        maxPeople: tours.maxPeople,
        images: tours.images,
        location: tours.location,
        startDate: tours.startDate,
        endDate: tours.endDate,
        features: tours.features,
        includes: tours.includes,
        excludes: tours.excludes,
        schedule: tours.schedule,
        faqs: tours.faqs,
        enableComments: tours.enableComments,
        showLikes: tours.showLikes,
        showRating: tours.showRating,
        metaTitle: tours.metaTitle,
        metaDescription: tours.metaDescription,
        metaKeywords: tours.metaKeywords,
        createdAt: tours.createdAt,
        owner: {
          id: users.id,
          name: users.name,
          slug: users.slug,
          phone: users.phone,
          avatar: users.avatar,
        },
      })
      .from(tours)
      .leftJoin(users, eq(tours.ownerId, users.id))
      .where(eq(tours.id, id))
      .limit(1);

    if (!tour || tour.length === 0) {
      return NextResponse.json(
        { success: false, message: "تور یافت نشد" },
        { status: 404 }
      );
    }

    // تبدیل schedule از JSON string به object اگر نیاز باشد
    const tourData = { ...tour[0] };
    if (tourData.schedule && Array.isArray(tourData.schedule)) {
      tourData.schedule = tourData.schedule.map((day) => {
        try {
          return typeof day === "string" ? JSON.parse(day) : day;
        } catch {
          return day;
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: tourData,
    });
  } catch (error) {
    console.error(`❌ GET tour ${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات تور",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - به‌روزرسانی جزئی تور
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "شناسه تور معتبر نیست" },
        { status: 400 }
      );
    }
    const tourId = parseInt(id);
    // بررسی وجود تور
    const existingTour = await db
      .select({ id: tours.id })
      .from(tours)
      .where(eq(tours.id, id))
      .limit(1);

    if (existingTour.length === 0) {
      return NextResponse.json(
        { success: false, message: "تور یافت نشد" },
        { status: 404 }
      );
    }

    // دریافت داده‌های به‌روزرسانی
    const body = await request.json();

    const {
      title,
      ownerSlug,
      description,
      price,
      maxPeople,
      location,
      features,
      includes,
      excludes,
      schedule,
      faqs,
      enableComments,
      showLikes,
      showRating,
      metaTitle,
      metaDescription,
      metaKeywords,
      seoSlug,
      images,
      startDate,
      endDate,
    } = body;

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData = {};

    // بررسی و اضافه کردن فیلدها
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (maxPeople !== undefined)
      updateData.maxPeople = maxPeople ? Number(maxPeople) : null;
    if (location !== undefined) updateData.location = location;
    if (features !== undefined)
      updateData.features = Array.isArray(features) ? features : [];
    if (includes !== undefined)
      updateData.includes = Array.isArray(includes) ? includes : [];
    if (excludes !== undefined)
      updateData.excludes = Array.isArray(excludes) ? excludes : [];
    if (faqs !== undefined) updateData.faqs = Array.isArray(faqs) ? faqs : [];
    if (enableComments !== undefined)
      updateData.enableComments = enableComments;
    if (showLikes !== undefined) updateData.showLikes = showLikes;
    if (showRating !== undefined) updateData.showRating = showRating;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;
    if (metaKeywords !== undefined)
      updateData.metaKeywords = Array.isArray(metaKeywords) ? metaKeywords : [];
    if (images !== undefined) {
      updateData.images = Array.isArray(images)
        ? images.filter(
            (img) =>
              typeof img === "string" &&
              (img.startsWith("http://") ||
                img.startsWith("https://") ||
                img.startsWith("/") ||
                img.startsWith("data:image/"))
          )
        : [];
    }
    if (startDate !== undefined)
      updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined)
      updateData.endDate = endDate ? new Date(endDate) : null;

    // اگر ownerSlug تغییر کرده
    if (ownerSlug !== undefined) {
      const ownerResult = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.slug, ownerSlug))
        .limit(1);

      if (!ownerResult.length) {
        return NextResponse.json(
          { success: false, message: "مالک جدید یافت نشد" },
          { status: 404 }
        );
      }
      updateData.ownerId = ownerResult[0].id;
    }

    // اگر schedule تغییر کرده
    if (schedule !== undefined) {
      updateData.schedule = Array.isArray(schedule)
        ? schedule.map((day) =>
            typeof day === "object" ? JSON.stringify(day) : day
          )
        : [];
    }

    // اگر slug تغییر کرده
    if (seoSlug !== undefined && seoSlug.trim()) {
      // بررسی یکتایی slug جدید
      const existingSlug = await db
        .select({ id: tours.id })
        .from(tours)
        .where(and(eq(tours.slug, seoSlug), ne(tours.id, id)))
        .limit(1);

      if (existingSlug.length > 0) {
        return NextResponse.json(
          { success: false, message: "اسلاگ تکراری است" },
          { status: 400 }
        );
      }
      updateData.slug = seoSlug;
    }

    // به‌روزرسانی تور
    const [updatedTour] = await db
      .update(tours)
      .set(updateData)
      .where(eq(tours.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "تور با موفقیت به‌روزرسانی شد",
      data: updatedTour,
    });
  } catch (error) {
    console.error(`❌ PATCH tour ${params.id} error:`, error);

    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, message: "اسلاگ تکراری است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی تور",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف تور
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه نامعتبر است" },
        { status: 400 }
      );
    }
    const tourId = parseInt(id);
    const deleted = await db
      .delete(tours)
      .where(eq(tours.id, id))
      .returning({ id: tours.id });

    if (!deleted.length) {
      return NextResponse.json(
        { success: false, message: "تور یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تور با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("❌ DELETE tour error:", error);

    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          message: "ابتدا رکوردهای وابسته را حذف کنید",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف تور",
      },
      { status: 500 }
    );
  }
}
