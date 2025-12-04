// src/lib/jwt.js
import { SignJWT, jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "please_set_a_secret";
const encoder = new TextEncoder();
const KEY = encoder.encode(SECRET);

export async function signToken(payload = {}, opts = { expiresIn: "7d" }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(
      typeof opts.expiresIn === "string" ? opts.expiresIn : `${opts.expiresIn}s`
    )
    .sign(KEY);
  return token;
}

export async function verifyToken(token) {
  try {
    const verified = await jwtVerify(token, KEY);
    return verified.payload;
  } catch (err) {
    return null;
  }
}
