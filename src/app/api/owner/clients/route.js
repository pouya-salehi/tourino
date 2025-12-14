// app/api/owner/clients/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users, tours, bookings } from "@/db/schema";
import { eq, desc, and, or, like, sql, gte, lte, inArray } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// =======================
//        GET
// =======================
export async function GET(req) {
  try {
    // --- AUTH ---
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    let payload;
    try {
      const { payload: verified } = await jwtVerify(token, SECRET);
      payload = verified;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(payload.role))
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    // --- QUERIES ---
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const tourId = searchParams.get("tourId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;

    // --- GET TOURS ---
    let allTours = [];

    if (payload.role === "OWNER") {
      allTours = await db
        .select({
          id: tours.id,
          title: tours.title,
          slug: tours.slug,
          price: tours.price,
          startDate: tours.startDate,
          maxPeople: tours.maxPeople,
          description: tours.description,
        })
        .from(tours)
        .where(eq(tours.ownerId, payload.id));
    } else {
      allTours = await db
        .select({
          id: tours.id,
          title: tours.title,
          slug: tours.slug,
          price: tours.price,
          startDate: tours.startDate,
          ownerName: users.name,
        })
        .from(tours)
        .leftJoin(users, eq(tours.ownerId, users.id));
    }

    const ownerTourIds = allTours.map((t) => t.id);

    // --- OWNER WITH NO TOURS ---
    if (payload.role === "OWNER" && ownerTourIds.length === 0) {
      const owner = await db
        .select({
          id: users.id,
          name: users.name,
          phone: users.phone,
          nationalCode: users.nationalCode,
          createdAt: users.createdAt,
          slug: users.slug,
        })
        .from(users)
        .where(eq(users.id, payload.id))
        .limit(1);

      if (!owner.length) {
        return NextResponse.json({
          success: true,
          clients: [],
          tours: [],
          stats: {},
          pagination: { page: 1, limit, total: 0, totalPages: 0 },
          message: "No tours yet",
        });
      }

      const self = owner[0];

      return NextResponse.json({
        success: true,
        clients: [
          {
            id: `owner-${self.id}`,
            userId: self.id,
            fullName: self.name,
            phone: self.phone,
            nationalCode: self.nationalCode,
            role: "OWNER",
            tourTitle: "—",
            people: 0,
            price: 0,
            status: "OWNER",
            createdAt: self.createdAt,
            bookingDate: null,
          },
        ],
        tours: [],
        stats: {
          totalClients: 1,
          totalRevenue: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
        },
        pagination: { page: 1, limit, total: 1, totalPages: 1 },
      });
    }

    // --- FILTERS ---
    const filters = [];

    if (payload.role === "OWNER")
      filters.push(inArray(bookings.tourId, ownerTourIds));

    if (tourId && tourId !== "all")
      filters.push(eq(bookings.tourId, Number(tourId)));

    if (status && status !== "all") filters.push(eq(bookings.status, status));

    if (startDate) filters.push(gte(bookings.createdAt, new Date(startDate)));

    if (endDate) filters.push(lte(bookings.createdAt, new Date(endDate)));

    if (search.trim()) {
      const s = `%${search}%`;
      filters.push(
        or(like(users.name, s), like(users.phone, s), like(tours.title, s))
      );
    }

    const where = filters.length ? and(...filters) : undefined;

    // --- MAIN QUERY ---
    const rows = await db
      .select({
        bookingId: bookings.id,
        bookingStatus: bookings.status,
        people: bookings.people,
        price: bookings.price,
        bookingCreatedAt: bookings.createdAt,

        userId: users.id,
        userName: users.name,
        userPhone: users.phone,
        nationalCode: users.nationalCode,

        tourId: tours.id,
        tourTitle: tours.title,
        tourSlug: tours.slug,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.userId, users.id))
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(where)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

    // --- COUNT ---
    const total = await db
      .select({ c: sql`count(*)` })
      .from(bookings)
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(where)
      .then((r) => Number(r[0].c));

    // --- STATS ---
    const statsRaw = await db
      .select({
        status: bookings.status,
        count: sql`count(*)`,
        revenue: sql`sum(${bookings.price})`,
      })
      .from(bookings)
      .innerJoin(tours, eq(bookings.tourId, tours.id))
      .where(
        payload.role === "OWNER"
          ? inArray(bookings.tourId, ownerTourIds)
          : undefined
      )
      .groupBy(bookings.status);

    const stats = {
      totalClients: total,
      totalRevenue: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };

    statsRaw.forEach((s) => {
      stats[s.status.toLowerCase()] = Number(s.count);
      if (s.revenue) stats.totalRevenue += Number(s.revenue);
    });

    // --- FORMAT CLIENTS ---
    const clients = rows.map((b) => ({
      id: b.bookingId,
      userId: b.userId,
      fullName: b.userName,
      phone: b.userPhone,
      nationalCode: b.nationalCode,
      tourId: b.tourId,
      tourTitle: b.tourTitle,
      people: b.people,
      price: b.price,
      status: b.bookingStatus,
      createdAt: b.bookingCreatedAt,
      bookingDate: new Date(b.bookingCreatedAt).toLocaleDateString("fa-IR"),
    }));

    // --- FORMAT TOURS ---
    const formattedTours = allTours.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      price: t.price,
      startDate: t.startDate
        ? new Date(t.startDate).toLocaleDateString("fa-IR")
        : null,
    }));

    // --- RESPONSE ---
    return NextResponse.json({
      success: true,
      clients,
      tours: formattedTours,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ /api/owner/clients error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

// =======================
//        POST
// (test seed creator)
// =======================
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    let payload;
    try {
      payload = (await jwtVerify(token, SECRET)).payload;
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    if (!["OWNER", "ADMIN"].includes(payload.role))
      return NextResponse.json({ success: false }, { status: 403 });

    const { action } = await req.json();

    if (action !== "create-test-clients")
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );

    // --- Insert test users (ignore conflicts) ---
    const testUsers = [
      {
        phone: "09121112222",
        name: "محمد احمدی",
        role: "USER",
        nationalCode: "1111111111",
      },
      {
        phone: "09123334444",
        name: "فاطمه رضایی",
        role: "USER",
        nationalCode: "2222222222",
      },
      {
        phone: "09125556666",
        name: "علی کریمی",
        role: "USER",
        nationalCode: "3333333333",
      },
    ];

    const created = [];

    for (const u of testUsers) {
      const [usr] = await db
        .insert(users)
        .values(u)
        .onConflictDoNothing({ target: users.phone })
        .returning();

      if (usr) created.push(usr);
    }

    // --- Ensure tour exists ---
    let [tour] = await db
      .select()
      .from(tours)
      .where(eq(tours.ownerId, payload.id))
      .limit(1);

    if (!tour) {
      [tour] = await db
        .insert(tours)
        .values({
          ownerId: payload.id,
          title: "تور تستی",
          slug: "test-tour",
          price: 1500000,
          maxPeople: 10,
          startDate: new Date(),
        })
        .returning();
    }

    // --- Create bookings ---
    if (created.length) {
      await db.insert(bookings).values(
        created.map((u, i) => ({
          tourId: tour.id,
          userId: u.id,
          people: i + 1,
          price: tour.price * (i + 1),
          status: ["PENDING", "CONFIRMED", "COMPLETED"][i],
        }))
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seed created",
      created: created.length,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 }
    );
  }
}
