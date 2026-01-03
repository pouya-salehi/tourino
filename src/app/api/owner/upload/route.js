import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// ❗ خارج از public
const UPLOAD_DIR = path.join(process.cwd(), "storage", "verifications");
const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export async function POST(req) {
  try {
    // 1. Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "OWNER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 2. FormData
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "فایل نامعتبر" }, { status: 400 });
    }

    // 3. Validation
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "حجم فایل بیش از حد مجاز است" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { message: "فرمت فایل مجاز نیست" },
        { status: 400 }
      );
    }

    // 4. Save
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = ALLOWED_TYPES[file.type];
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // ❗ URL نمی‌دیم
    return NextResponse.json({
      success: true,
      fileKey: filename,
    });
  } catch (err) {
    console.error("SECURE UPLOAD ERROR:", err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
