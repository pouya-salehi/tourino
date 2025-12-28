// components/tours/modals/tour-modal-detail/tabs/TourDetailsTab.jsx
import {
  Eye,
  Heart,
  Star,
  MessageSquare,
  Shield,
  Settings,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"
export default function TourDetailsTab({ tour }) {
  return (
    <ScrollArea className="h-100 w-full">
      <div className="space-y-6 animate-in fade-in duration-300">
      {/* تنظیمات نمایش */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600 " />
          تنظیمات نمایش
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span>نظرات</span>
            </div>
            <Badge variant={tour.enableComments ? "success" : "secondary"}>
              {tour.enableComments ? "فعال" : "غیرفعال"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-xl">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>لایک‌ها</span>
            </div>
            <Badge variant={tour.showLikes ? "success" : "secondary"}>
              {tour.showLikes ? "نمایش" : "مخفی"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span>امتیاز</span>
            </div>
            <Badge variant={tour.showRating ? "success" : "secondary"}>
              {tour.showRating ? "نمایش" : "مخفی"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* اطلاعات مالک */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          اطلاعات مالک
        </h3>
        {tour.owner ? (
          <div className=" p-5 rounded-xl border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {tour.owner.name?.[0] || "?"}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{tour.owner.name}</div>
                <div className="text-gray-600">@{tour.owner.slug}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {tour.owner.phone}
                </div>
                {tour.owner.verifyStatus === "APPROVED" && (
                  <Badge variant="success" className="mt-2">
                    ✅ تأیید شده
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">مالک مشخص نشده</div>
        )}
      </div>

      <Separator />

      {/* اطلاعات فنی */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-700" />
          اطلاعات فنی
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1 p-3 bg-gray-50 dark:bg-transparent rounded-lg">
            <div className="text-sm text-gray-500">شناسه</div>
            <div className="font-mono font-bold">#{tour.id}</div>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 dark:bg-transparent rounded-lg">
            <div className="text-sm text-gray-500">اسلاگ</div>
            <div className="font-mono truncate">{tour.slug}</div>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 dark:bg-transparent rounded-lg">
            <div className="text-sm text-gray-500">تاریخ ایجاد</div>
            <div className="font-medium">
              {new Date(tour.createdAt).toLocaleDateString("fa-IR")}
            </div>
          </div>
          <div className="space-y-1 p-3 bg-gray-50 dark:bg-transparent rounded-lg">
            <div className="text-sm text-gray-500">مالک ID</div>
            <div className="font-mono">{tour.owner?.id || "-"}</div>
          </div>
        </div>
      </div>
    </div>
    </ScrollArea>
  );
}
