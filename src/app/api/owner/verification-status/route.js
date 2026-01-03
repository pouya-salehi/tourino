import { NextResponse } from "next/server";
import db from "@/db";
import { verificationDocuments, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    // 1. Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, SECRET);

    // 2. Query
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug || payload.slug !== slug) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // 3. Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 4. Get last verification request
    const doc = await db
      .select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.ownerId, user[0].id))
      .orderBy(desc(verificationDocuments.createdAt))
      .limit(1);

    if (!doc.length) {
      return NextResponse.json({
        success: true,
        status: "NOT_SUBMITTED",
      });
    }

    return NextResponse.json({
      success: true,
      status: doc[0].status,
      requestNumber: doc[0].requestNumber,
      adminNote: doc[0].adminNote,
      reviewedAt: doc[0].reviewedAt,
    });
  } catch (err) {
    console.error("verification-status error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
