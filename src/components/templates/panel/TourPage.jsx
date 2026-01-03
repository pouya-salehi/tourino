// components/templates/profile/ProfilePage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileTours from "./ProfileTours";
import ProfileStats from "./ProfileStats";
import ProfileActions from "./ProfileActions";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

        const response = await fetch(`/api/users/${slug}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("صفحه‌ای با این آدرس یافت نشد");
          }
          throw new Error(`خطای سرور: ${response.status}`);
        }

        const data = await response.json();

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

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
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
    <div className="min-h-screen mt-4">
      <div className="mx-auto sm:px-6 lg:px-8 py-8">
        <ProfileHeader profile={profile} tours={tours}/>
        {/* <ProfileStats tours={tours} profile={profile} /> */}
        <ProfileActions profile={profile} slug={slug} />
        <div className="mt-12 mb-4">
          {tours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">هنوز توری ثبت نشده است</p>
            </div>
          ) : (
            <ProfileTours tours={tours} profile={profile} />
          )}
        </div>

        <Separator className="bg-black/20 dark:bg-white/20"/>
        <div className="mt-16 pt-8 text-center">
          <p className="text-sm text-gray-500">
            صفحه شخصی {profile.name} |
            {profile.createdAt && (
              <span>
                {" "}
                عضویت از{" "}
                {new Date(profile.createdAt).toLocaleDateString("fa-IR")}
              </span>
            )}
          </p>
          {profile.verifyStatus === "APPROVED" && (
            <p className="text-xs text-green-600 mt-1">
              ✅ این حساب احراز هویت شده است
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
