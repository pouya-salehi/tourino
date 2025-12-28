// lib/auth.js - نسخه کارکرده
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// تابع verifyToken با استفاده از drizzle select
async function verifyToken(token) {
  try {
    if (!token || !process.env.JWT_SECRET) {
      console.error("JWT_SECRET یا توکن موجود نیست");
      return null;
    }

    // 🔥 دیکود کردن توکن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", { id: decoded.id });

    // 🔥 درست کردن query - از select استفاده کن نه query
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1)
      .then((rows) => rows[0] || null);

    console.log(
      "✅ User from DB:",
      user ? `id=${user.id}, name=${user.name}` : "not found"
    );
    return user;
  } catch (error) {
    console.error("❌ verifyToken error:", error.message);
    return null;
  }
}

// برای API Routes
export async function getUserFromRequest(req) {
  try {
    // 1. از کوکی بخون
    const cookieHeader = req.headers.get("cookie");

    if (cookieHeader) {
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        const user = await verifyToken(token);
        if (user) {
          console.log("✅✅ User authenticated via cookie:", user.id);
          return user;
        }
      }
    }

    // 2. از هدر Authorization بخون
    const authHeader = req.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = await verifyToken(token);
      if (user) return user;
    }

    console.log("❌ No user found");
    return null;
  } catch (error) {
    console.error("❌ getUserFromRequest error:", error);
    return null;
  }
}

// برای Server Components
export async function getUserFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("No token in cookies");
      return null;
    }

    return await verifyToken(token);
  } catch (err) {
    console.error("getUserFromCookies error:", err);
    return null;
  }
}
