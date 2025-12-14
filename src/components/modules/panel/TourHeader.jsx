// components/modules/tour/TourHeader.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Share2,
  Heart,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TourHeader({ tour }) {
  const [isSaved, setIsSaved] = useState(false);

  const bannerImage = tour.images?.[0] || "/default-banner.jpg";
  const owner = tour.owner || {};

  const formatDate = (date) => {
    if (!date) return "مشخص نشده";
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* تصویر بک‌گراند با افکت */}
      <div className="absolute inset-0 z-0">
        <img
          src={bannerImage}
          alt={tour.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8"
          >
            {/* اطلاعات اصلی */}
            <div className="flex-1 text-white">
              {/* دسته‌بندی و برچسب‌ها */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {tour.category || "تور"}
                </Badge>
                {tour.isFeatured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    ویژه
                  </Badge>
                )}
                {owner.verifyStatus === "APPROVED" && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    تأیید شده
                  </Badge>
                )}
              </div>

              {/* عنوان */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-4">
                {tour.title}
              </h1>

              {/* توضیح کوتاه */}
              <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                {tour.description?.slice(0, 200)}
                {tour.description?.length > 200 && "..."}
              </p>

              {/* اطلاعات جزئی */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-300" />
                  <span>تاریخ شروع: {formatDate(tour.startDate)}</span>
                </div>

                {tour.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-300" />
                    <span>{tour.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-300" />
                  <span>ظرفیت: {tour.maxPeople} نفر</span>
                </div>

                {tour.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span>{tour.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* قیمت */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                <div className="text-gray-300 text-sm">شروع قیمت از</div>
                <div className="text-3xl font-bold text-white">
                  {tour.price.toLocaleString()}{" "}
                  <span className="text-lg">تومان</span>
                </div>
              </div>
            </div>

            {/* اطلاعات صاحب تور و اکشن‌ها */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              {/* صاحب تور */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src={owner.avatar || "/default-avatar.png"}
                    alt={owner.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                  {owner.verifyStatus === "APPROVED" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white">{owner.name}</h3>
                  <p className="text-gray-300 text-sm">صاحب تور</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{owner.phone}</span>
                  </div>
                </div>
              </div>

              {/* دکمه‌های اکشن */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart
                    className={`w-4 h-4 ml-2 ${
                      isSaved ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isSaved ? "ذخیره شده" : "ذخیره"}
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <Share2 className="w-4 h-4 ml-2" />
                  اشتراک‌گذاری
                </Button>

                {owner.phone && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white col-span-2"
                    onClick={() =>
                      (window.location.href = `tel:${owner.phone}`)
                    }
                  >
                    <Phone className="w-4 h-4 ml-2" />
                    تماس با صاحب تور
                  </Button>
                )}

                {/* دکمه پنل برای صاحب تور */}
                {tour.isOwner && (
                  <a href={`/${tour.slug}/panel`} className="col-span-2">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold">
                      ورود به پنل مدیریت
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
