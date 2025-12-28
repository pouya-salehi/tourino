// components/tours/modals/tour-modal-detail/tabs/TourCommentsTab.jsx
"use client";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  Heart,
  CornerDownLeft,
  Send,
  ChevronsDown,
  Calendar,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// تابع تبدیل تاریخ
const DateConvertor = (date) => {
  if (!date) return "نامشخص";
  const now = new Date();
  const commentDate = new Date(date);
  const diffMs = now - commentDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "همین الان";
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;

  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function TourCommentsTab({ tourId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // دریافت کامنت‌ها از API
  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/tours/create/${tourId}/comments?page=${pageNum}`
      );
      const data = await res.json();

      if (data.success) {
        if (pageNum === 1) {
          setComments(data.data || []);
        } else {
          setComments((prev) => [...prev, ...(data.data || [])]);
        }
        setHasMore(
          data.pagination?.page < data.pagination?.totalPages || false
        );
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("خطا در دریافت کامنت‌ها:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourId) {
      fetchComments(1);
    }
  }, [tourId]);

  // ارسال کامنت جدید
  const submitComment = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`/api/tours/create/${tourId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          parentId: replyTo?.id || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // اضافه کردن کامنت جدید به ابتدای لیست
        setComments((prev) => [data.data, ...prev]);
        setContent("");
        setReplyTo(null);
      } else {
        alert(data.message || "خطا در ارسال کامنت");
      }
    } catch (error) {
      console.error("خطا در ارسال کامنت:", error);
      alert("خطا در ارسال کامنت");
    }
  };

  // لایک کردن کامنت (اختیاری)
  const likeComment = async (commentId) => {
    try {
      const res = await fetch(
        `/api/tours/create/${tourId}/comments/${commentId}/like`,
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if (data.success) {
        // آپدیت تعداد لایک‌ها در کامنت
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  liked: data.liked,
                  likeCount: data.liked
                    ? (c.likeCount || 0) + 1
                    : (c.likeCount || 0) - 1,
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("خطا در لایک:", error);
    }
  };

  // کامپوننت تک کامنت
  const Comment = ({ comment, depth = 0 }) => (
    <div className={`flex gap-3 ${depth ? "ml-8 mt-3" : "mt-4"}`}>
      <Avatar className="h-9 w-9">
        {comment.user?.avatar ? (
          <AvatarImage src={comment.user.avatar} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            {comment.user?.name?.[0] || "?"}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">
            {comment.user?.slug || "کاربر"}
          </span>
          {comment.user?.verifyStatus === "APPROVED" && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              ✅ تأیید شده
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {DateConvertor(comment.createdAt)}
          </span>
        </div>

        <Card className="border-none bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm shadow-sm">
          {replyTo?.id === comment.id && (
            <span className="text-blue-600 font-medium mr-1">
              @{replyTo.user?.slug}:{" "}
            </span>
          )}
          {comment.content}
        </Card>

        <div className="flex gap-4 mt-2 text-xs">
          <button
            onClick={() => likeComment(comment.id)}
            className={`flex gap-1 items-center ${
              comment.liked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${comment.liked ? "fill-red-500" : ""}`}
            />
            <span>{comment.likeCount || 0}</span>
          </button>

          {depth < 2 && (
            <button
              onClick={() => setReplyTo(comment)}
              className="flex gap-1 items-center text-muted-foreground hover:text-blue-500"
            >
              <CornerDownLeft className="h-3 w-3" />
              پاسخ
            </button>
          )}
        </div>

        {/* نمایش ریپلای‌ها */}
        {comment.replies?.map((r) => (
          <Comment key={r.id} comment={r} depth={depth + 1} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="shadow-xl rounded-3xl p-6 relative dark:border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <MessageCircle />
          نظرات {comments.length > 0 && `(${comments.length})`}
        </h3>

        {replyTo && (
          <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            <span className="text-muted-foreground">در پاسخ به:</span>
            <span className="font-medium">@{replyTo.user?.slug}</span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              ✕ لغو
            </button>
          </div>
        )}
      </div>

      {/* فرم ارسال کامنت */}
      <div className="mb-6 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none rounded-2xl min-h-[100px]"
          placeholder={
            replyTo
              ? `در پاسخ به @${replyTo.user?.slug}...`
              : "نظر خود را درباره این تور بنویسید..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              submitComment();
            }
          }}
        />
        <Button
          onClick={submitComment}
          disabled={!content.trim()}
          className="absolute right-3 bottom-14 h-10 w-10 rounded-full"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
        <div className="text-xs text-muted-foreground mt-2 mr-2">
          برای ارسال، Ctrl+Enter را بزنید
        </div>
      </div>

      {/* لیست کامنت‌ها */}
      <ScrollArea className="h-42">
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-muted-foreground">
                در حال بارگذاری نظرات...
              </p>
            </div>
          ) : comments.length > 0 ? (
            <>
              <div className="space-y-4">
                {comments.map((c) => (
                  <Comment key={c.id} comment={c} />
                ))}
              </div>

              {/* دکمه‌های پاگی‌نیشن */}
              <div className="flex flex-col items-center gap-4 mt-8">
                {hasMore && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const next = page + 1;
                        setPage(next);
                        fetchComments(next);
                      }}
                      className="flex items-center gap-2"
                    >
                      نمایش نظرات بیشتر
                      <ChevronsDown className="h-4 w-4" />
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      صفحه {page}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            // 🎯 اینجا پیام "هیچ کامنتی وجود ندارد" نشون داده می‌شه
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium mb-2">
                هیچ کامنتی وجود ندارد
              </h4>
              <p className="text-muted-foreground mb-6">
                اولین نفری باشید که نظر می‌دهد
              </p>
              <Button
                onClick={() => document.querySelector("textarea")?.focus()}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                نوشتن اولین نظر
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
