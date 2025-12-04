// app/api/generate-contract/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import puppeteer from "puppeteer";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function auth(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

// تابع تولید HTML قرارداد
function generateContractHTML(userData) {
  const today = new Date();
  const todayJalali = format(today, "dd MMMM yyyy", { locale: faIR });

  return `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تعهدنامه تورلیدر</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Vazirmatn', sans-serif;
        }
        
        body {
            padding: 40px 60px;
            line-height: 1.8;
            color: #333;
            background: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2c5282;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #2c5282;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header .date {
            color: #4a5568;
            font-size: 14px;
        }
        
        .content {
            margin: 30px 0;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section h2 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 10px;
            border-right: 4px solid #4299e1;
            padding-right: 10px;
        }
        
        .section p {
            text-align: justify;
            margin-bottom: 12px;
            font-size: 14px;
        }
        
        .user-info {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .user-info h3 {
            color: #2d3748;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #cbd5e0;
            padding-bottom: 8px;
        }
        
        .info-item .label {
            font-weight: 600;
            color: #4a5568;
        }
        
        .info-item .value {
            color: #2d3748;
        }
        
        .signatures {
            margin-top: 60px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
        }
        
        .signature-box {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #cbd5e0;
        }
        
        .signature-box h4 {
            margin-bottom: 40px;
            color: #4a5568;
        }
        
        .stamp {
            margin: 30px auto;
            width: 120px;
            height: 120px;
            border: 2px dashed #c53030;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c53030;
            font-weight: bold;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 12px;
        }
        
        @media print {
            body {
                padding: 20px 30px;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📄 تعهدنامه Gototour و صاحب مجوز تور</h1>
        <div class="date">تاریخ صدور: ${todayJalali}</div>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>ماده ۱ - طرفین قرارداد</h2>
            <p>این تعهدنامه فی‌مابین <strong>${
              userData.name || ""
            }</strong> دارنده کد ملی <strong>${
    userData.nationalCode || ""
  }</strong> و شماره پروانه کسب <strong>${
    userData.licenseNumber || ""
  }</strong> به عنوان «تورلیدر/صاحب تور» (متعهد) و «سامانه گردشگری» به عنوان «واگذارنده» منعقد می‌گردد.</p>
        </div>
        
        <div class="section">
            <h2>ماده ۲ - موضوع تعهد</h2>
            <p>تورلیدر متعهد می‌شود کلیه خدمات گردشگری را مطابق با قوانین جمهوری اسلامی ایران، مقررات سازمان میراث فرهنگی و گردشگری و ضوابط اخلاق حرفه‌ای ارائه نماید.</p>
        </div>
        
        <div class="section">
            <h2>ماده ۳ - مسئولیت‌ها</h2>
            <p>۱. تورلیدر مسئول کامل امنیت، رفاه و سلامتی مسافرین در طول سفر می‌باشد.</p>
            <p>۲. در صورت بروز هرگونه حادثه ناشی از قصور یا بی‌احتیاطی، مسئولیت حقوقی و جبران خسارت بر عهده تورلیدر است.</p>
            <p>۳. تورلیدر مکلف است از ارائه هرگونه اطلاعات نادرست به مسافرین خودداری کند.</p>
        </div>
        
        <div class="section">
            <h2>ماده ۴ - ضمانت اجرا</h2>
            <p>تخلف از هر یک از بندهای این تعهدنامه، موجب تعلیق یا لغو مجوز فعالیت در سامانه و پیگرد قانونی خواهد بود.</p>
        </div>
    </div>
    
    <div class="user-info">
        <h3>📋 اطلاعات ثبت‌شده تورلیدر</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">نام کامل:</span>
                <span class="value">${userData.name || ""}</span>
            </div>
            <div class="info-item">
                <span class="label">شماره موبایل:</span>
                <span class="value">${userData.phone || ""}</span>
            </div>
            <div class="info-item">
                <span class="label">کد ملی:</span>
                <span class="value">${userData.nationalCode || ""}</span>
            </div>
            <div class="info-item">
                <span class="label">شماره پروانه:</span>
                <span class="value">${userData.licenseNumber || ""}</span>
            </div>
            <div class="info-item">
                <span class="label">تاریخ صدور:</span>
                <span class="value">${todayJalali}</span>
            </div>
            <div class="info-item">
                <span class="label">شماره قرارداد:</span>
                <span class="value">TOR-${Date.now()
                  .toString()
                  .slice(-8)}</span>
            </div>
        </div>
    </div>
    
    <div class="signatures">
        <div class="signature-box">
            <h4>امضاء و مهر تورلیدر</h4>
            <div class="stamp">مهر و امضاء</div>
            <p>نام: ${userData.name || ""}</p>
            <p>کد ملی: ${userData.nationalCode || ""}</p>
        </div>
        
        <div class="signature-box">
            <h4>امضاء و مهر سامانه</h4>
            <div class="stamp">مهر سامانه</div>
            <p>سامانه گردشگری</p>
            <p>تاریخ: ${todayJalali}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>این سند به صورت الکترونیکی تولید شده و دارای اعتبار قانونی می‌باشد.</p>
        <p>شماره پیگیری: ${
          "CONTRACT-" + Date.now().toString(36).toUpperCase()
        }</p>
    </div>
</body>
</html>
  `;
}

export async function GET(req) {
  try {
    // احراز هویت
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // دریافت slug از query parameters
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "شناسه پروفایل الزامی است" },
        { status: 400 }
      );
    }

    // بررسی دسترسی
    if (
      user.role !== "ADMIN" &&
      (user.role !== "OWNER" || user.slug !== slug)
    ) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // دریافت اطلاعات کاربر از دیتابیس
    const userData = await db
      .select({
        name: users.name,
        phone: users.phone,
        nationalCode: users.nationalCode,
        licenseNumber: users.licenseNumber,
        profileCompleted: users.profileCompleted,
      })
      .from(users)
      .where(eq(users.slug, slug))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // چک کردن تکمیل پروفایل
    if (!userData[0].profileCompleted) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا پروفایل خود را تکمیل کنید" },
        { status: 400 }
      );
    }

    // تولید HTML قرارداد
    const htmlContent = generateContractHTML(userData[0]);

    // راه‌اندازی Puppeteer برای تولید PDF
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // تنظیم viewport
      await page.setViewport({ width: 1200, height: 1600 });

      // تنظیم محتوای HTML
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      // تولید PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "40px",
          right: "30px",
          bottom: "40px",
          left: "30px",
        },
      });

      await browser.close();

      // ایجاد نام فایل
      const fileName = `تعهدنامه_${
        userData[0].name || "تورلیدر"
      }_${Date.now()}.pdf`;

      // بازگشت PDF به عنوان پاسخ
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(
            fileName
          )}"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } catch (puppeteerError) {
      console.error("Puppeteer error:", puppeteerError);

      // اگر Puppeteer کار نکرد، یک فایل PDF ساده برگردان
      const fallbackResponse = `
تعهدنامه تورلیدر

این تعهدنامه به صورت الکترونیکی برای ${userData[0].name} با کد ملی ${
        userData[0].nationalCode
      } صادر شده است.

لطفاً برای دریافت نسخه کامل PDF، از مرورگر دیگری استفاده کنید یا با پشتیبانی تماس بگیرید.

شماره پیگیری: FALLBACK-${Date.now()}
      `;

      return new NextResponse(fallbackResponse, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="تعهدنامه_موقت.pdf"`,
        },
      });
    }
  } catch (error) {
    console.error("Generate contract error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در تولید قرارداد" },
      { status: 500 }
    );
  }
}
