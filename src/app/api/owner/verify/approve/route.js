//app/api/owner/verify/approve/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { verificationDocuments } from "@/db/schema";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    let payload;
    try {
      const { payload: verified } = await jwtVerify(token, SECRET);
      payload = verified;
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    if (payload.role !== "ADMIN")
      return NextResponse.json({ success: false }, { status: 403 });

    const { ownerId } = await req.json();

    await db
      .update(verificationDocuments)
      .set({ status: "APPROVED", adminNote: "تأیید شده" })
      .where(eq(verificationDocuments.ownerId, ownerId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
