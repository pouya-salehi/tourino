import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json(
      {
        user: {
          id: payload.sub,
          phone: payload.phone,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
