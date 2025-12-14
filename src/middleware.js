// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // -------------------------------
  // 🔓 مسیرهای عمومی
  // -------------------------------
  const publicPaths = ["/", "/signup", "/signin"];
  const publicStartsWith = [
    "/api/auth",
    "/_next",
    "/favicon",
    "/images",
    "/icons",
    "/assets",
    "/public",
    "/fonts",
  ];

  if (
    publicPaths.includes(pathname) ||
    publicStartsWith.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // -------------------------------
  // 🔒 اگر توکن نباشه → ریدایرکت
  // -------------------------------
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // -------------------------------
  // 🔐 اعتبارسنجی JWT
  // -------------------------------
  let payload;
  try {
    const verified = await jwtVerify(token, SECRET);
    payload = verified.payload;
  } catch (error) {
    const response = NextResponse.redirect(new URL("/signin", req.url));
    response.cookies.delete("token");
    return response;
  }

  const role = payload.role;
  const userSlug = payload.slug;
  console.log("MIDDLEWARE ROLE:", payload.role);
  console.log("MIDDLEWARE SLUG:", payload.slug);

  // -------------------------------
  // 🎯 منطق جدید: OWNER دسترسی کامل دارد
  // -------------------------------

  // اگر کاربر OWNER است → اجازه دسترسی به همه جا (به جز /owner)
  if (role === "OWNER") {
    return NextResponse.next();
  }

  // -------------------------------
  // 🔒 محافظت از مسیر ADMIN (/owner)
  // فقط ADMIN اجازه دارد
  // -------------------------------
  if (pathname.startsWith("/owner")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/client", req.url));
    }
    return NextResponse.next();
  }

  // -------------------------------
  // 🔒 محافظت از پنل صاحب تور → /:slug/panel
  // فقط OWNER همان slug یا ADMIN
  // -------------------------------
  if (pathname.includes("/panel")) {
    const slug = pathname.split("/")[1];

    if (role === "ADMIN") {
      return NextResponse.next(); // مدیر کل آزاد است
    }

    if (role === "OWNER" && userSlug === slug) {
      return NextResponse.next(); // صاحب تور معتبر
    }

    if (role === "OWNER" && userSlug !== slug) {
      return NextResponse.redirect(new URL(`/${userSlug}/panel`, req.url));
    }

    if (role === "USER") {
      return NextResponse.redirect(new URL("/client", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/client")) {
    if (role !== "USER") {
      if (role === "OWNER") {
        return NextResponse.redirect(new URL(`/${userSlug}/panel`, req.url));
      }
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/owner", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/client/:path*", "/:slug/panel/:path*"],
};
