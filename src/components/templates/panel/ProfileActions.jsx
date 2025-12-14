// components/modules/profile/ProfileActions.jsx
"use client";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageSquare,
  Share2,
  Mail,
  Calendar,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfileActions({ profile, slug }) {
  const { user } = useAuth();
  const router = useRouter();

  // اگر کاربر مالک این پروفایله
  const isOwner = user?.slug === slug;

  const handleCall = () => {
    if (profile.phone) {
      window.open(`tel:${profile.phone}`, "_blank");
    }
  };

  const handleMessage = () => {
    // اینجا می‌تونی modal چت باز کنی
    toast.info(`ارسال پیام به ${profile.name}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: profile.name,
        text: `صفحه شخصی ${profile.name} در کاپرتور`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک کپی شد!");
    }
  };

  const handleGoToPanel = () => {
    router.push(`/${slug}/panel`);
  };

  const handleCreateTour = () => {
    router.push(`/${slug}/panel/tours/new`);
  };

  return (
    <div className="bg-white mb-8">
      <div className="flex flex-wrap gap-3 justify-center md:justify-between">
        {/* اکشن‌های عمومی */}
        <div className="flex flex-wrap gap-3">
          {profile.phone && (
            <Button
              onClick={handleCall}
              className="bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4 ml-2" />
              تماس
            </Button>
          )}

          <Button
            onClick={handleMessage}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <MessageSquare className="w-4 h-4 ml-2" />
            پیام
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Share2 className="w-4 h-4 ml-2" />
            اشتراک‌گذاری
          </Button>
        </div>

        {/* اکشن‌های مخصوص مالک */}
        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGoToPanel}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Users className="w-4 h-4 ml-2" />
              پنل مدیریت
            </Button>

            <Button
              onClick={handleCreateTour}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Calendar className="w-4 h-4 ml-2" />
              ساخت تور جدید
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
