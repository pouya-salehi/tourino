// components/modules/profile/ProfileActions.jsx
"use client";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageSquare,
  Share2,
  PanelsLeftBottom,
  Calendar,
  BadgePlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
export default function ProfileActions({ profile, slug }) {
  const { user } = useAuth();
  const router = useRouter();
  // اگر کاربر مالک این پروفایله
  const isOwner = user.role;
  const handleCall = () => {
    if (profile.phone) {
      window.open(`tel:${profile.phone}`, "_blank");
    }
  };

  const handleMessage = () => {
    // اینجا می‌تونی modal چت باز کنی
    toast.info(`ارسال پیام به ${profile.name}`);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const link = `${window.location.origin}/${slug}`;
      await navigator.clipboard.writeText(link);
      toast.success("لینک با موفقیت کپی شد");
    } catch (err) {
      toast.error("خطا در کپی لینک" || err);
    }
  };

  const handleGoToPanel = () => {
    router.push(`/${slug}/panel`);
  };

  const handleCreateTour = () => {
    router.push(`/${slug}/panel/add-tour`);
  };

  return (
    <div className="flex mb-8">
      <div className="flex flex-wrap gap-3 justify-between lg:justify-between w-full">
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
            className="bg-white border-none hover:bg-blue-50"
          >
            <MessageSquare className="w-4 h-4 ml-2" />
            پیام
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="bg-white border-none hover:bg-purple-50"
          >
            <Share2 className="w-4 h-4 ml-2" />
            اشتراک‌گذاری
          </Button>
        </div>

        {/* اکشن‌های مخصوص مالک */}
        <div>
          {isOwner && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGoToPanel}
                className=" bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <PanelsLeftBottom className="w-4 h-4 ml-2" />
                پنل مدیریت
              </Button>

              <Button
                onClick={handleCreateTour}
                variant="outline"
                className="bg-white border-none hover:bg-green-50"
              >
                <BadgePlus className="w-4 h-4 ml-2" />
                ساخت تور جدید
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
