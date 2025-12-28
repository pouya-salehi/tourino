// app/api/tours/create/[id]/comments/route.js
import { NextResponse } from "next/server";
import db from "@/db";
import { comments, users, commentLikes, tours } from "@/db/schema";
import { eq, and, desc, count, inArray } from "drizzle-orm"; // <-- inArray اضافه شد
import { getUserFromRequest, getUserFromCookies } from "@/lib/auth";

/* ----------------------------------------
   GET | دریافت کامنت‌های یک تور
---------------------------------------- */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const tourId = Number(id);

    if (isNaN(tourId)) {
      return NextResponse.json(
        { success: false, message: "tourId نامعتبر است" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
    const sort = searchParams.get("sort") || "newest";

    const offset = (page - 1) * limit;

    // دریافت یوزر (برای isLiked)
    const currentUser = await getUserFromCookies();

    // دریافت کامنت‌ها
    const rows = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
          slug: users.slug,
          verifyStatus: users.verifyStatus,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.tourId, tourId), eq(comments.isDeleted, false)))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    // اگر کامنتی وجود نداشت
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // دریافت تعداد لایک‌ها برای هر کامنت
    // 🔥 اصلاح اینجا: به جای .in() از inArray استفاده کن
    const commentIds = rows.map((r) => r.id);

    const likes = await db
      .select({
        commentId: commentLikes.commentId,
        count: count(commentLikes.id),
      })
      .from(commentLikes)
      .where(inArray(commentLikes.commentId, commentIds)) // <-- درست شده
      .groupBy(commentLikes.commentId);

    // ساخت مپ برای دسترسی سریع
    const likesMap = new Map();
    likes.forEach((like) => {
      likesMap.set(like.commentId, like.count);
    });

    // اضافه کردن likeCount به کامنت‌ها
    const commentsWithLikes = rows.map((comment) => ({
      ...comment,
      likeCount: likesMap.get(comment.id) || 0,
      liked: currentUser ? false : false,
    }));

    // تعداد کل کامنت‌ها
    const [{ total }] = await db
      .select({ total: count() })
      .from(comments)
      .where(and(eq(comments.tourId, tourId), eq(comments.isDeleted, false)));

    // گروه‌بندی ریپلای‌ها
    const commentsMap = new Map();
    const rootComments = [];

    commentsWithLikes.forEach((comment) => {
      commentsMap.set(comment.id, { ...comment, replies: [] });
    });

    commentsWithLikes.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentsMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentsMap.get(comment.id));
        }
      } else {
        rootComments.push(commentsMap.get(comment.id));
      }
    });

    return NextResponse.json({
      success: true,
      data: rootComments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ GET comments error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت کامنت‌ها" },
      { status: 500 }
    );
  }
}

// app/api/tours/create/[id]/comments/route.js - بخش POST اصلاح شده
/* ----------------------------------------
   POST | ثبت کامنت جدید
---------------------------------------- */
export async function POST(req, { params }) {
  try {
    // Auth کار می‌کنه ✅
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً وارد شوید",
        },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", user.id, user.name);

    const { id } = await params;
    const tourId = Number(id);

    if (isNaN(tourId)) {
      return NextResponse.json(
        { success: false, message: "tourId نامعتبر است" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const content = body.content?.trim();
    const parentId = body.parentId ? Number(body.parentId) : null;

    if (!content || content.length < 1) {
      return NextResponse.json(
        { success: false, message: "متن کامنت الزامی است" },
        { status: 400 }
      );
    }

    // 🔥 اصلاح اینجا: بررسی وجود تور با select
    const tourExists = await db
      .select()
      .from(tours)
      .where(eq(tours.id, tourId))
      .limit(1)
      .then((rows) => rows[0] || null);

    if (!tourExists) {
      return NextResponse.json(
        { success: false, message: "تور یافت نشد" },
        { status: 404 }
      );
    }

    // 🔥 اصلاح اینجا: بررسی parent (برای reply)
    if (parentId) {
      const parent = await db
        .select()
        .from(comments)
        .where(eq(comments.id, parentId))
        .limit(1)
        .then((rows) => rows[0] || null);

      if (!parent) {
        return NextResponse.json(
          { success: false, message: "کامنت والد یافت نشد" },
          { status: 404 }
        );
      }
    }

    // 🔥 ثبت کامنت
    const [created] = await db
      .insert(comments)
      .values({
        tourId,
        userId: user.id,
        content,
        parentId,
        isDeleted: false,
      })
      .returning();

    // 🔥 برگرداندن همراه با user
    const fullComment = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
          slug: users.slug,
          verifyStatus: users.verifyStatus,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, created.id))
      .then((res) => res[0] || null);

    return NextResponse.json({
      success: true,
      message: "کامنت با موفقیت ثبت شد",
      data: fullComment,
    });
  } catch (error) {
    console.error("❌ POST comment error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ثبت کامنت" },
      { status: 500 }
    );
  }
}
