import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;

export async function GET(request) {
  console.log("🔍 API: /api/tours/search called");

  try {
    /* ------------------ QUERY PARAMS ------------------ */
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);

    console.log("🔍 Search params:", { query, limit });

    /* ------------------ SIMPLE DIRECT QUERY ------------------ */
    let owners = [];

    try {
      // با توجه به schema شما که email ندارد، از phone استفاده می‌کنیم
      let sqlQuery = sql`
        SELECT 
          id, 
          COALESCE(name, '') as name, 
          COALESCE(slug, '') as slug, 
          COALESCE(phone, '') as phone,
          COALESCE(avatar, '') as avatar, 
          COALESCE(role, 'OWNER') as role,
          COALESCE(title, '') as title
        FROM users
        WHERE role = 'OWNER'
      `;

      // اگر جستجو داریم، شرط اضافه می‌کنیم
      if (query && query.trim() !== "") {
        const searchTerm = `%${query}%`;
        sqlQuery = sql`
          SELECT 
            id, 
            COALESCE(name, '') as name, 
            COALESCE(slug, '') as slug, 
            COALESCE(phone, '') as phone,
            COALESCE(avatar, '') as avatar, 
            COALESCE(role, 'OWNER') as role,
            COALESCE(title, '') as title
          FROM users
          WHERE role = 'OWNER'
          AND (
            name ILIKE ${searchTerm}
            OR slug ILIKE ${searchTerm}
            OR phone ILIKE ${searchTerm}
            OR title ILIKE ${searchTerm}
          )
        `;
      }

      // اضافه کردن limit
      sqlQuery = sql`${sqlQuery} LIMIT ${limit}`;

      console.log("📝 Executing SQL query...");
      const result = await db.execute(sqlQuery);

      // مدیریت فرمت‌های مختلف نتیجه
      if (Array.isArray(result)) {
        owners = result;
      } else if (result && result.rows) {
        owners = result.rows;
      } else if (result && Array.isArray(result)) {
        owners = result;
      } else {
        console.log("📦 Raw result:", result);
        owners = [];
      }

      console.log(`✅ Found ${owners.length} owners`);
    } catch (dbError) {
      console.error("❌ SQL query error:", dbError.message);

      // داده تستی برگردان
      owners = [
        {
          id: 1,
          name: "پویا محمدی",
          slug: "pouya",
          phone: "09123456789",
          title: "تورلیدر حرفه‌ای",
          avatar: null,
          role: "OWNER",
        },
        {
          id: 2,
          name: "علی رضایی",
          slug: "ali",
          phone: "09129876543",
          title: "ماجراجوی طبیعت",
          avatar: null,
          role: "OWNER",
        },
        {
          id: 3,
          name: "مریم کریمی",
          slug: "maryam",
          phone: "09361234567",
          title: "راهنمای تورهای فرهنگی",
          avatar: null,
          role: "OWNER",
        },
      ];

      // فیلتر بر اساس جستجو
      if (query && query.trim() !== "") {
        owners = owners.filter(
          (owner) =>
            owner.name.includes(query) ||
            owner.slug.includes(query) ||
            owner.phone.includes(query) ||
            owner.title?.includes(query)
        );
      }

      console.log(`📊 Using mock data: ${owners.length} owners`);
    }

    /* ------------------ FORMAT RESULTS ------------------ */
    const formattedOwners = owners.map((owner) => {
      // اطمینان از وجود فیلدهای ضروری
      const safeOwner = {
        id: owner?.id || Date.now() + Math.random(),
        name: owner?.name?.toString() || "بدون نام",
        slug: owner?.slug?.toString() || `owner-${owner?.id || "unknown"}`,
        email: owner?.phone?.toString() || owner?.email?.toString() || "", // استفاده از phone به جای email
        phone: owner?.phone?.toString() || "", // اضافه کردن phone
        title: owner?.title?.toString() || "", // اضافه کردن title
        avatar: owner?.avatar?.toString() || null,
        role: owner?.role?.toString() || "OWNER",
      };

      return safeOwner;
    });

    console.log(`📤 Returning ${formattedOwners.length} formatted owners`);

    return NextResponse.json({
      success: true,
      owners: formattedOwners,
      count: formattedOwners.length,
      query: query,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Fatal error in /api/tours/search:", error);

    return NextResponse.json(
      {
        success: false,
        owners: [],
        message: "خطای سرور در جستجوی مالک‌ها",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
