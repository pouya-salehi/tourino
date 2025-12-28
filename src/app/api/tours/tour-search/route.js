// app/api/tours/tour-search/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { tours, users } from "@/db/schema";
import { ilike, or, eq } from "drizzle-orm";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const data = await db
    .select({
      id: tours.id,
      title: tours.title,
      slug: tours.slug,
      location: tours.location,
      image: tours.images[0],
      ownerSlug: users.slug,
    })
    .from(tours)
    .leftJoin(users, eq(tours.ownerId, users.id))
    .where(or(ilike(tours.title, `%${q}%`), ilike(tours.location, `%${q}%`)))
    .limit(5);

  return NextResponse.json({ data });
}
