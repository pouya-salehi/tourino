import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Eye,
  Star,
  Heart,
  MessageSquare,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

export default function TourDetailsModal({ tour, open, onOpenChange }) {
  if (!tour) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: faIR });
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString("fa-IR") + " تومان" : "رایگان";
  };

  const getStatusBadge = (endDate) => {
    if (!endDate) return <Badge variant="outline">بدون تاریخ</Badge>;

    const now = new Date();
    const end = new Date(endDate);

    if (end < now) {
      return <Badge variant="destructive">منقضی شده</Badge>;
    } else if (end < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return (
        <Badge variant="default" className="bg-amber-500">
          به زودی
        </Badge>
      );
    } else {
      return <Badge variant="success">فعال</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-7xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 py-6">
            <Hash className="h-5 w-5" />
            جزئیات کامل تور
          </DialogTitle>
          <DialogDescription>اطلاعات کامل تور "{tour.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* اطلاعات اصلی */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">اطلاعات اصلی</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">مکان:</span>
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">قیمت:</span>
                  <span className="text-green-600">
                    {formatPrice(tour.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">حداکثر نفرات:</span>
                  <span>{tour.maxPeople || "نامحدود"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">تاریخ شروع:</span>
                  <span>{formatDate(tour.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">تاریخ پایان:</span>
                  <span>{formatDate(tour.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">وضعیت:</span>
                  {getStatusBadge(tour.endDate)}
                </div>
              </div>
            </div>
          </div>

          {/* مالک */}
          <div>
            <h3 className="font-semibold mb-3">اطلاعات مالک</h3>
            {tour.owner ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {tour.owner.name?.[0] || "?"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{tour.owner.name}</div>
                    <div className="text-sm text-gray-600">
                      @{tour.owner.slug} | {tour.owner.phone}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 italic">مالک مشخص نشده</div>
            )}
          </div>

          <Separator />

          {/* تنظیمات نمایش */}
          <div>
            <h3 className="font-semibold mb-3">تنظیمات نمایش</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="h-4 w-4" />
                <span>نظرات:</span>
                <Badge variant={tour.enableComments ? "success" : "secondary"}>
                  {tour.enableComments ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Heart className="h-4 w-4" />
                <span>لایک‌ها:</span>
                <Badge variant={tour.showLikes ? "success" : "secondary"}>
                  {tour.showLikes ? "نمایش" : "مخفی"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Star className="h-4 w-4" />
                <span>امتیاز:</span>
                <Badge variant={tour.showRating ? "success" : "secondary"}>
                  {tour.showRating ? "نمایش" : "مخفی"}
                </Badge>
              </div>
            </div>
          </div>

          {/* امکانات */}
          {tour.features && tour.features.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">امکانات تور</h3>
                <div className="flex flex-wrap gap-2">
                  {tour.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1">
                      <Tag className="h-3 w-3 ml-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* اطلاعات فنی */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">اطلاعات فنی</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">شناسه</div>
                <div className="font-mono">{tour.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">اسلاگ</div>
                <div className="font-mono">{tour.slug}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">تاریخ ایجاد</div>
                <div>{formatDate(tour.createdAt)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">مالک ID</div>
                <div className="font-mono">{tour.owner?.id || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
