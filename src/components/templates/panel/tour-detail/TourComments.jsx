// components/tours/comments/TourComments.jsx
"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Heart,
  CornerDownLeft,
  Send,
  ChevronsDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
//helper
import { DateConvertor } from "@/lib/DateConvertor";
export default function TourComments({ tourId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async (pageNum = 1) => {
    setLoading(true);
    const res = await fetch(
      `/api/tours/create/${tourId}/comments?page=${pageNum}`
    );
    const data = await res.json();

    if (data.success) {
      setComments((prev) =>
        pageNum === 1 ? data.data : [...prev, ...data.data]
      );
      setHasMore(pageNum < data.pagination.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments(1);
  }, [tourId]);

  const submitComment = async () => {
    if (!content.trim()) return;

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
      setComments((prev) => [data.data, ...prev]);
      setContent("");
      setReplyTo(null);
    }
  };
  const isDisabled = !content.trim();
  const likeComment = async (id) => {
    const res = await fetch(`/api/tours/create/${tourId}/comments/${id}/like`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.success) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                liked: data.liked,
                likeCount: data.liked ? c.likeCount + 1 : c.likeCount - 1,
              }
            : c
        )
      );
    }
  };

  const Comment = ({ comment, depth = 0 }) => (
    <div className={`flex gap-3 ${depth ? "ml-8 mt-3" : "mt-4"}`}>
      <Avatar className="h-9 w-9">
        {comment.user.avatar ? (
          <AvatarImage src={comment.user.avatar} />
        ) : (
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1">
        <div className="text-sm font-semibold">
          {comment.user.slug}
          <span className="text-xs text-muted-foreground mr-2">
            {DateConvertor(comment.createdAt)}
          </span>
        </div>

        <Card className="border-none shadow-none rounded-lg p-3 text-sm">
          {comment.content}
        </Card>

        <div className="flex gap-4 mt-2 text-xs">
          {/* <button
            onClick={() => likeComment(comment.id)}
            className={`flex gap-1 items-center ${
              comment.liked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${comment.liked ? "fill-red-500" : ""}`}
            />
            {comment.likeCount}
          </button> */}

          {depth < 1 && (
            <button
              onClick={() => setReplyTo(comment)}
              className="flex gap-1 items-center text-muted-foreground"
            >
              <CornerDownLeft className="h-3 w-3" />
              پاسخ
            </button>
          )}
        </div>

        {comment.replies?.map((r) => (
          <Comment key={r.id} comment={r} depth={depth + 1} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="shadow-xl rounded-4xl p-6 relative dark:border">
      <h3 className="flex items-center gap-2 text-lg font-bold mb-6">
        <MessageCircle />
        نظرات
      </h3>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="resize-none rounded-2xl"
        placeholder={
          replyTo ? `در پاسخ به @${replyTo.user.slug}` : "نظر خود را بنویسید"
        }
      />
      <Button
        onClick={submitComment}
        disabled={!content.trim()}
        className="absolute top-22 left-10 rounded-full py-7"
      >
        <Send />
      </Button>

      <div className="mt-6 space-y-4">
        {loading ? "در حال بارگذاری..." : null}

        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
        <div className="flex items-center justify-center">
          <Button className="bg-transparent dark:text-white shadow-none border-none text-gray-500 hover:shadow-none cursor-pointer">
            نظرات بیشتر
            <ChevronsDown />
          </Button>
        </div>
        {hasMore && (
          <Button
            variant="outline"
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchComments(next);
            }}
          >
            نمایش بیشتر
          </Button>
        )}
      </div>
    </div>
  );
}
