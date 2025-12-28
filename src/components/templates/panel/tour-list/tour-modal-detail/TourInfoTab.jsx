// components/tours/modals/tour-modal-detail/tabs/TourInfoTab.jsx
import { MapPin, DollarSign, Users, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

export default function TourInfoTab({ tour }) {
    console.log(tour)
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* هدر */}
      <div className="p-6 rounded-4xl border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">{tour.title}</h2>
        <p className="text-gray-600 dark:text-white">{tour.description}</p>
      </div>

      {/* اطلاعات اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-500 dark:text-white" />
            اطلاعات مکانی
          </h3>
          <div className="bg-white p-4 rounded-xl shadow-sm border dark:bg-transparent">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 dark:text-white">مکان:</span>
              <span className="font-medium">{tour.location || "نامشخص"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-white">وضعیت:</span>
              {getStatusBadge(tour.endDate)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500 dark:text-white" />
            اطلاعات مالی
          </h3>
          <div className="bg-white p-4 rounded-xl shadow-sm border dark:bg-transparent">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 dark:text-white">قیمت:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatPrice(tour.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-white">ظرفیت:</span>
              <span className="font-medium">
                {tour.maxPeople || "نامحدود"} نفر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* تاریخ‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500 dark:text-white" />
            تاریخ‌های تور
          </h3>
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3 dark:bg-transparent">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-white">شروع:</span>
              <span className="font-medium">{formatDate(tour.startDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-white">پایان:</span>
              <span className="font-medium">{formatDate(tour.endDate)}</span>
            </div>
          </div>
        </div>

        {/* امکانات */}
        {tour.features && tour.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              امکانات
            </h3>
            <div className="flex flex-wrap gap-2">
              {tour.features.map((feature, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
