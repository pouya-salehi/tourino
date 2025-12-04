import { jwtVerify } from "jose";

async function verifyToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload; // { userId, role, slug }
  } catch {
    return null;
  }
}
