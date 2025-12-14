import { db } from "@/db";
import { modals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const user = await getUserFromCookies();
  if (!user || user.role !== "OWNER")
    return NextResponse.json({ status: "failed" }, { status: 401 });

  await db.delete(modals).where(eq(modals.id, Number(params.id)));

  return NextResponse.json({ status: "success", message: "deleted" });
}
