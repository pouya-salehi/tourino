import { NextResponse } from "next/server";
import db from "@/db";
import { users, verificationDocuments } from "@/db/schema";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let payload;
    try {
      const { payload: verified } = await jwtVerify(token, SECRET);
      payload = verified;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // فقط ADMIN
    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // دریافت صاحبان تور
    const owners = await db.select().from(users).where(eq(users.role, "OWNER"));

    // خروجی با چسباندن مدارک
    const fullData = [];

    for (let owner of owners) {
      const docs = await db
        .select()
        .from(verificationDocuments)
        .where(eq(verificationDocuments.ownerId, owner.id));

      fullData.push({
        ...owner,
        verification: docs?.[0] || null,
      });
    }

    return NextResponse.json({ success: true, owners: fullData });
  } catch (err) {
    console.error("owner list error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
