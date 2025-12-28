"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";

function TourCard({ tour, profile }) {
  if (!profile) {
    profile = {
      slug: "unknown",
      name: "نامشخص",
      avatar: null,
    };
  }

  const formatDate = (date) => {
    if (!date) return "نامشخص";
    return new Date(date).toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2);
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="h-[400px]"
    >
      <Card className="relative h-full overflow-hidden rounded-2xl shadow-xl">
        {/* IMAGE WRAPPER (مهم‌ترین بخش) */}
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.12 },
          }}
          transition={{
            duration: 1,
            ease: [0.19, 1, 0.22, 1], // easeOutExpo
          }}
          className="absolute inset-0"
        >
          {tour.images?.[0] ? (
            <img
              src={tour.images[0]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500" />
          )}
        </motion.div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* OWNER */}
        <div className="absolute top-0 left-0 w-full z-10 flex justify-end p-2">
          <Link
            href={`/${profile.slug}`}
            className="flex items-center gap-2 backdrop-blur-sm px-2 rounded-full"
          >
            <span className="text-white text-xs">{profile.slug}@</span>
            <Avatar className="w-10 h-10 border-2 border-white  shadow-lg shadow-black/50">
              {profile.avatar && (
                <AvatarImage src={profile.avatar} alt={profile.name} />
              )}
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <div className="mb-4">
            <h3 className="text-xl font-extrabold mb-2 line-clamp-2">
              {tour.title}
            </h3>

            <div className="flex flex-wrap gap-2 text-xs">
              {tour.location && (
                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {tour.location}
                </span>
              )}

              {tour.startDate && (
                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {formatDate(tour.startDate)}
                </span>
              )}

              {tour.maxPeople && (
                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3" />
                  {tour.maxPeople} نفر
                </span>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center border-t border-white/20 pt-4">
            <div>
              <div className="text-lg font-bold">
                {tour.price?.toLocaleString()}{" "}
                <span className="text-orange-300 text-sm">تومان</span>
              </div>
              <div className="text-xs text-white/60">به ازای هر نفر</div>
            </div>

            <div className="flex gap-2">
              <button className="px-2 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
                <span className="mt-2">0</span>
                <Heart className="w-5 h-5 cursor-pointer" />
              </button>

              <Link href={`/${profile.slug}/${tour.slug}`}>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 font-semibold"
                >
                  مشاهده
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default TourCard;
