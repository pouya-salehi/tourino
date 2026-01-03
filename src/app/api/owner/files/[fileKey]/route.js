// app/api/owner/files/[fileKey]/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { readFile, stat } from "fs/promises";
import path from "path";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const UPLOAD_DIR = path.join(process.cwd(), "storage", "verifications");

// لیست فایل‌های مجاز (پسوندها)
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

export async function GET(req, { params }) {
  try {
    // 1. احراز هویت
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);
    if (!["OWNER", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 2. گرفتن fileKey از params
    const { fileKey } = await params;

    if (!fileKey) {
      return NextResponse.json(
        { message: "شناسه فایل الزامی است" },
        { status: 400 }
      );
    }

    // 3. چک کردن security (Path Traversal)
    const normalizedFileKey = path.normalize(fileKey);
    const base = path.resolve(UPLOAD_DIR);
    const filePath = path.resolve(UPLOAD_DIR, normalizedFileKey);

    // مطمئن شو فایل داخل پوشه مجاز است
    if (!filePath.startsWith(base)) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    // 4. چک کردن پسوند فایل
    const ext = path.extname(filePath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { message: "فرمت فایل مجاز نیست" },
        { status: 400 }
      );
    }

    // 5. چک کردن وجود فایل
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ message: "فایل یافت نشد" }, { status: 404 });
    }

    // 6. خواندن فایل
    const fileBuffer = await readFile(filePath);

    // 7. تعیین Content-Type بر اساس پسوند
    const contentType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
      }[ext] || "application/octet-stream";

    // 8. ایجاد filename برای download
    const downloadName = path.basename(filePath);

    // 9. برگرداندن فایل
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          downloadName
        )}"`,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("File download error:", error);

    // اگر JWT مشکل داشت
    if (error.code === "ERR_JWT_INVALID") {
      return NextResponse.json({ message: "توکن نامعتبر" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "خطا در دریافت فایل" },
      { status: 500 }
    );
  }
}

// OPTIONS برای CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
