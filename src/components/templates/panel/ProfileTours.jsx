// components/modules/profile/ProfileTours.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function ProfileTours({ tours, profile }) {
  const { slug } = useParams();
  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          هنوز توری ثبت نشده است
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {profile.name} هنوز هیچ توری ایجاد نکرده است.
          {profile.isOwner && "می‌توانید اولین تور خود را ایجاد کنید."}
        </p>

        {profile.isOwner && (
          <Button>
            <Link href={`/${slug}/panel/add-tour`}>ساخت اولین تور</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          تورهای {profile.name}
        </h2>
        <span className="text-gray-600">{tours.length} تور</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}

function TourCard({ tour }) {
  const formatDate = (date) => {
    if (!date) return "نامشخص";
    return new Date(date).toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
      {/* عکس تور */}
      {tour.images?.[0] && (
        <div className="h-48 overflow-hidden">
          <img
            src={tour.images[0]}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <CardContent className="p-4">
        {/* عنوان و توضیحات کوتاه */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {tour.title}
        </h3>

        {tour.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {tour.description}
          </p>
        )}

        {/* جزئیات */}
        <div className="space-y-2 mt-4">
          {tour.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{tour.location}</span>
            </div>
          )}

          {tour.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{formatDate(tour.startDate)}</span>
            </div>
          )}

          {tour.maxPeople && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-green-500" />
              <span>{tour.maxPeople} نفر</span>
            </div>
          )}

          {tour.price && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-gray-900">
                {tour.price.toLocaleString()} تومان
              </span>
            </div>
          )}
        </div>

        {/* دکمه مشاهده */}
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
          مشاهده و رزرو
        </Button>
      </CardContent>
    </Card>
  );
}
