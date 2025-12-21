import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "فایلی ارسال نشده" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `${crypto.randomUUID()}${ext}`;

    // ✅ مسیر پوشه
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // ✅ اگر پوشه نبود بساز
    await mkdir(uploadDir, { recursive: true });

    const uploadPath = path.join(uploadDir, filename);

    await writeFile(uploadPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ message: "خطا در آپلود فایل" }, { status: 500 });
  }
}
