// components/templates/profile/ProfilePage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileTours from "./ProfileTours";
import ProfileStats from "./ProfileStats";
import ProfileActions from "./ProfileActions";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage({ slug }) {
  const [profile, setProfile] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        console.log("📡 Fetching profile for:", slug);

        const response = await fetch(`/api/users/${slug}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        console.log("📊 Response status:", response.status);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("صفحه‌ای با این آدرس یافت نشد");
          }
          throw new Error(`خطای سرور: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("پاسخ سرور نامعتبر است");
        }

        const data = await response.json();
        console.log("📦 API data:", data);

        if (!data.success) {
          throw new Error(data.message || "خطا در دریافت اطلاعات");
        }

        setProfile(data.user);
        setTours(data.tours || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // Loading State
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="p-4">
        <div className="w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">خطا</h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-4 h-4 ml-2" />
              بازگشت به خانه
            </Button>

            <Button variant="outline" onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">مشخصات یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileHeader profile={profile} />
        <ProfileActions profile={profile} slug={slug} />
        <ProfileTours tours={tours} profile={profile} />
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            صفحه شخصی {profile.name} | عضویت از {profile.joinDate}
          </p>
          {profile.isVerified && (
            <p className="text-xs text-green-600 mt-1">
              ✅ این حساب احراز هویت شده است
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// کامپوننت Skeleton برای loading
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* هدر */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* تورها */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 mb-4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
