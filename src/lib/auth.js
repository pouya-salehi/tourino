import { jwtVerify } from "jose";
import { cookies as nextCookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "CHANGE_ME");

export async function getUserFromCookies(req = null) {
  try {
    let token = null;

    // حالت API Route
    if (req && req.cookies) {
      token = req.cookies.get("token")?.value || null;
    }

    // حالت Server Component / Route Handler بدون req
    if (!token) {
      const cookieStore = nextCookies();
      token = cookieStore.get("token")?.value || null;
    }

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return payload; // شامل: { id, slug, role, ... }
  } catch (err) {
    return null;
  }
}
