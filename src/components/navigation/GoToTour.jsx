// src/components/GoToTour.jsx
"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function GoToTour() {
  const { user } = useAuth();
  const [ownerSlug, setOwnerSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user || user.role !== "OWNER") {
      setLoading(false);
      return;
    }

    // اگر slug در user وجود دارد
    if (user.slug) {
      setOwnerSlug(user.slug);
      setLoading(false);
      return;
    }

    // در غیر اینصورت از API بگیر
    try {
      const response = await fetch("/api/tours/profile", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.user?.slug) {
        setOwnerSlug(data.user.slug);
      } else {
        console.warn("No slug found in profile response");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // 🔴 نمایش toast فقط در محیط development
      if (process.env.NODE_ENV === "development") {
        toast.error("خطا در دریافت اطلاعات پروفایل");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // اگر loading هست یا user وجود ندارد یا OWNER نیست
  if (loading || !user || user.role !== "OWNER") {
    return null;
  }

  // اگر هنوز slug نداریم
  if (!ownerSlug) {
    // 🔴 می‌تونی یه fallback نشون بدی یا مخفی کنی
    return (
      <Button
        disabled
        className="font-bold px-4 cursor-not-allowed ml-6 opacity-50"
        title="اسلاگ تور در دسترس نیست"
      >
        برو به صفحه اصلی تور
      </Button>
    );
  }

  // 🔴 URL validation
  const isValidSlug = /^[a-z0-9\-_]+$/i.test(ownerSlug);
  if (!isValidSlug) {
    console.error("Invalid slug detected:", ownerSlug);
    return null;
  }

  return (
    <Button variant="outline" className="ml-6 bg-inherit dark:text-white border-white">
      <Link
        href={`/${encodeURIComponent(ownerSlug)}`}
        prefetch={false}
        aria-label={`برو به صفحه تور ${ownerSlug}`}
      >
        برو به صفحه اصلی تور{" "}
      </Link>
    </Button>
  );
}
