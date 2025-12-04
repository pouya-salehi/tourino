// app/api/owner/clients/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, tours, bookings } from "@/db/schema";
import { eq, desc, and, or, like, sql, gte, lte } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    // 1. احراز هویت
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // 2. وریفای توکن
    let payload;
    try {
      const { payload: verified } = await jwtVerify(token, SECRET);
      payload = verified;
    } catch (error) {
      console.error("JWT verify error:", error);
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر" },
        { status: 401 }
      );
    }

    // 3. چک کردن نقش - فقط OWNER و ADMIN
    if (payload.role !== "OWNER" && payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز. فقط صاحبان تور و ادمین" },
        { status: 403 }
      );
    }

    // 4. گرفتن پارامترهای جستجو
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const tourId = searchParams.get("tourId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    console.log("📊 Fetching clients for owner:", {
      ownerId: payload.id,
      role: payload.role,
      search,
      tourId,
      status,
    });

    // 5. ساختن شرط‌های فیلتر برای bookings
    const bookingConditions = [];

    // اگر ADMIN هست، همه bookings رو ببین
    // اگر OWNER هست، فقط bookings تورهای خودش رو ببین
    if (payload.role === "OWNER") {
      // اول تورهای این OWNER رو پیدا می‌کنیم
      const ownerTours = await db
        .select({ id: tours.id })
        .from(tours)
        .where(eq(tours.ownerId, payload.id));

      const tourIds = ownerTours.map((t) => t.id);

      if (tourIds.length === 0) {
        // این OWNER هیچ توری ندارد
        return NextResponse.json({
          success: true,
          clients: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
          filters: {
            tours: [],
            statuses: [
              { value: "PENDING", label: "در انتظار" },
              { value: "CONFIRMED", label: "تایید شده" },
              { value: "CANCELLED", label: "لغو شده" },
              { value: "COMPLETED", label: "تکمیل شده" },
            ],
          },
          stats: {
            totalClients: 0,
            pending: 0,
            confirmed: 0,
            totalRevenue: 0,
          },
        });
      }

      // فقط bookings مربوط به تورهای این OWNER
      bookingConditions.push(
        sql`${bookings.tourId} IN (${sql.join(tourIds, sql`, `)})`
      );
    }

    // فیلتر بر اساس تور خاص
    if (tourId && !isNaN(tourId)) {
      bookingConditions.push(eq(bookings.tourId, parseInt(tourId)));
    }

    // فیلتر بر اساس وضعیت
    if (status) {
      bookingConditions.push(eq(bookings.status, status));
    }

    // فیلتر بر اساس تاریخ
    if (startDate) {
      bookingConditions.push(gte(bookings.createdAt, new Date(startDate)));
    }
    if (endDate) {
      bookingConditions.push(lte(bookings.createdAt, new Date(endDate)));
    }

    // 6. گرفتن bookings با اطلاعات کاربر و تور
    const whereCondition =
      bookingConditions.length > 0 ? and(...bookingConditions) : undefined;

    // Query اصلی برای گرفتن bookings
    const bookingsData = await db
      .select({
        // اطلاعات booking
        bookingId: bookings.id,
        bookingStatus: bookings.status,
        people: bookings.people,
        price: bookings.price,
        bookingCreatedAt: bookings.createdAt,

        // اطلاعات کاربر (مشتری)
        userId: users.id,
        firstname: users.name, // در schema شما name هست
        phone: users.phone,
        email: sql`NULL`, // چون در schema شما email نداریم
        nationalCode: users.nationalCode,

        // اطلاعات تور
        tourId: tours.id,
        tourTitle: tours.title,
        tourSlug: tours.slug,
        tourPrice: tours.price,

        // اطلاعات صاحب تور
        ownerId: tours.ownerId,
        ownerName: sql`owner_user.name`, // از join جداگانه می‌گیریم
        ownerSlug: sql`owner_user.slug`,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.userId, users.id))
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .innerJoin(users.as("owner_user"), eq(tours.ownerId, sql`owner_user.id`))
      .where(whereCondition)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

    // 7. گرفتن تعداد کل برای pagination
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(bookings)
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(whereCondition);

    const totalCount = totalCountResult[0]?.count || 0;

    // 8. گرفتن لیست تورهای این OWNER (برای فیلتر)
    let ownerTours = [];
    if (payload.role === "OWNER") {
      ownerTours = await db
        .select({
          id: tours.id,
          title: tours.title,
          slug: tours.slug,
          price: tours.price,
          startDate: tours.startDate,
        })
        .from(tours)
        .where(eq(tours.ownerId, payload.id))
        .orderBy(desc(tours.createdAt));
    } else if (payload.role === "ADMIN") {
      // اگر ADMIN هست، همه تورها رو بگیر
      ownerTours = await db
        .select({
          id: tours.id,
          title: tours.title,
          slug: tours.slug,
          price: tours.price,
          startDate: tours.startDate,
          ownerName: users.name,
          ownerSlug: users.slug,
        })
        .from(tours)
        .innerJoin(users, eq(tours.ownerId, users.id))
        .orderBy(desc(tours.createdAt));
    }

    // 9. آمار کلی
    // محاسبه کل درآمد
    const revenueResult = await db
      .select({ totalRevenue: sql`COALESCE(SUM(${bookings.price}), 0)` })
      .from(bookings)
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(whereCondition);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // آمار بر اساس status
    const statsByStatus = await db
      .select({
        status: bookings.status,
        count: sql`COUNT(*)`,
        revenue: sql`COALESCE(SUM(${bookings.price}), 0)`,
      })
      .from(bookings)
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(whereCondition)
      .groupBy(bookings.status);

    const stats = {
      totalClients: Number(totalCount),
      totalRevenue: Number(totalRevenue),
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };

    statsByStatus.forEach((stat) => {
      if (stat.status === "PENDING") stats.pending = Number(stat.count);
      if (stat.status === "CONFIRMED") stats.confirmed = Number(stat.count);
      if (stat.status === "CANCELLED") stats.cancelled = Number(stat.count);
      if (stat.status === "COMPLETED") stats.completed = Number(stat.count);
    });

    // 10. فرمت‌کردن داده‌ها برای پاسخ
    const formattedClients = bookingsData.map((booking) => ({
      id: booking.bookingId,
      userId: booking.userId,
      firstname: booking.firstname || "نامشخص",
      lastname: "", // در schema شما lastname نداریم
      phone: booking.phone,
      email: booking.email,
      nationalCode: booking.nationalCode,

      // اطلاعات رزرو
      tourId: booking.tourId,
      tourTitle: booking.tourTitle,
      tourSlug: booking.tourSlug,
      people: booking.people,
      price: booking.price,
      status: booking.bookingStatus,

      // تاریخ‌ها
      createdAt: booking.bookingCreatedAt
        ? new Date(booking.bookingCreatedAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",

      // برای نمایش
      fullName: booking.firstname || "مشتری",
      bookingDate: booking.bookingCreatedAt
        ? new Date(booking.bookingCreatedAt).toLocaleDateString("fa-IR")
        : "—",
    }));

    // 11. برگرداندن داده‌ها
    return NextResponse.json({
      success: true,
      clients: formattedClients,
      pagination: {
        page,
        limit,
        total: Number(totalCount),
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        tours: ownerTours.map((tour) => ({
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          price: tour.price,
          startDate: tour.startDate
            ? new Date(tour.startDate).toLocaleDateString("fa-IR")
            : null,
        })),
        statuses: [
          { value: "PENDING", label: "در انتظار تایید" },
          { value: "CONFIRMED", label: "تایید شده" },
          { value: "CANCELLED", label: "لغو شده" },
          { value: "COMPLETED", label: "تکمیل شده" },
        ],
      },
      stats,
      ownerInfo: {
        id: payload.id,
        name: payload.name,
        slug: payload.slug,
        role: payload.role,
        totalTours: ownerTours.length,
      },
    });
  } catch (error) {
    console.error("❌ Error in /api/owner/clients:", error);

    // لاگ کردن خطا برای دیباگ
    if (error.code) {
      console.error("Database error code:", error.code);
      console.error("Database error message:", error.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مشتری‌ها",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        clients: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        filters: { tours: [], statuses: [] },
        stats: {
          totalClients: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
          totalRevenue: 0,
        },
      },
      { status: 500 }
    );
  }
}
