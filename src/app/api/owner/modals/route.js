import { db } from "@/db";
import { modals } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";


export async function GET() {
  try {
    const data = await db.select().from(modals).orderBy(desc(modals.createdAt));
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return NextResponse.json({ status: "failed" }, { status: 500 });
  }
}

export async function POST(req) {
  const user = await getUserFromCookies();
  if (!user || user.role !== "OWNER") {
    return NextResponse.json(
      { status: "failed", message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const {
    title,
    expiresAt,
    backgroundType,
    backgroundValue,
    animation,
    couponPercentage,
  } = body;

  const modalData = await db
    .insert(modals)
    .values({
      title,
      expiresAt: new Date(expiresAt),
      backgroundType,
      backgroundValue,
      animation,
      couponPercentage,
      ownerId: user.id,
    })
    .returning();

  return NextResponse.json({ status: "success", data: modalData[0] });
}
