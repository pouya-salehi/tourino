import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GradientIcon from "@/context/GradientIcon";
import Link from "next/link";
function TourCard({ tour, profile }) {
  const formatDate = (date) => {
    if (!date) return "نامشخص";
    return new Date(date).toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="group relative h-[400px] overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 hover:shadow-2xl">
      {tour.images?.[0] && (
        <img
          src={tour.images[0]}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition duration-700 ease-in-out "
        />
      )}
      <div className="absolute top-0 left-0 w-full justify-end p-2 flex bg-gradient-to-b from-black/20 via-black/0 to-transparent">
        <div className="flex items-center gap-2 opacity-90 hover:opacity-100">
          <span className="text-white">{profile.slug}</span>
          <Avatar className="w-16 h-16 border-4 border-white shadow-xl">
            {profile.avatar ? (
              <AvatarImage
                src={profile.avatar}
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-xl font-bold">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div
        className="
          absolute inset-0 
          bg-gradient-to-t from-black/80 via-black/40 to-transparent
          transition-opacity duration-900
          group-hover:from-black/90
        "
      />
      <div
        className="
          relative z-10 h-full flex flex-col justify-end
          p-2 text-white
        "
      >
        <h3 className="text-xl font-extrabold mb-1 line-clamp-1 drop-shadow">
          {tour.title}
        </h3>

        {/* اطلاعات */}
        <div className="space-y-1 text-sm">
          {tour.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{tour.location}</span>
            </div>
          )}

          {tour.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(tour.startDate)}</span>
            </div>
          )}

          {tour.maxPeople && (
            <div className="flex items-center gap-2">
              <GradientIcon>
                <Users className="w-5 h-5" stroke="url(#icon-gradient)" />
              </GradientIcon>
              <span>{tour.maxPeople} نفر</span>
            </div>
          )}
        </div>
        <div
          className="
            mt-4 flex items-center justify-between
            translate-y-6 
            transition-all duration-500
          "
        >
          {tour.price && (
            <span className="text-lg font-bold">
              {tour.price.toLocaleString()} تومان
            </span>
          )}

          <div className="flex items-center gap-3">
            <Send title="ارسال به..." />
            <Link
              href={`/${profile.slug}/${tour.slug}`}
              className="inline-flex"
            >
              <Button size="sm" className="tracking-widest p-2 py-0.5">
                مشاهده و رزرو
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TourCard;
