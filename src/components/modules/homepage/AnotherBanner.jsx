"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import FloatingParticles from "./banner/FloatingParticles";
import BannerHeader from "./banner/BannerHEader";
import BannerCenter from "./banner/BannerCenter";
import BannerFeatures from "./banner/BannerFeatures";

const Banner = () => {
  const [isNight, setIsNight] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(new Date());
  const bannerRef = useRef();

  // به‌روزرسانی زمان
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const toggleMode = useCallback(() => setIsNight((p) => !p), []);
  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  }, []);

  // مسیر عکس‌ها (می‌تونی مسیر رو هرجایی که عکس‌هاتو گذاشتی تغییر بدی)
  const bgDay = "/images/banner-day.jpg";
  const bgNight = "/images/banner-night.jpg";

  const CurrentIcon = isNight ? Moon : Sun;

  const content = isNight
    ? {
        title: "شب خلاقانه",
        subtitle: "ایده‌هایت رو در آرامش شب بساز",
        desc: "با ابزارهای حرفه‌ای ما، در سکوت شب خلاقیتت رو شکوفا کن",
        cta: "کشف کن",
        features: ["طراحی خاص", "پشتیبانی ۲۴/۷", "امنیت بالا"],
      }
    : {
        title: "روز پرانرژی",
        subtitle: "شروعی تازه با انرژی مثبت",
        desc: "پروژه‌ات رو همین حالا شروع کن و از امکانات ما لذت ببر",
        cta: "شروع کن",
        features: ["طراحی مدرن", "سرعت بالا", "رایگان"],
      };

  return (
    <section
      ref={bannerRef}
      onClick={toggleMode}
      className="relative w-full h-[90vh] overflow-hidden rounded-3xl cursor-pointer select-none text-white"
    >
      {/* پس‌زمینه‌ی تصویر */}
      <div className="absolute inset-0">
        {/* عکس روز */}
        <motion.img
          key="day"
          src={bgDay}
          alt="day background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: isNight ? 0 : 1 }}
          animate={{ opacity: isNight ? 0 : 1 }}
          transition={{ duration: 1 }}
        />
        {/* عکس شب */}
        <motion.img
          key="night"
          src={bgNight}
          alt="night background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: isNight ? 1 : 0 }}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={{ duration: 1 }}
        />
        {/* فیلتر برای readability متن */}
        <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
      </div>

      {/* ذرات شناور */}
      <FloatingParticles isNight={isNight} />

      {/* لایه‌ی محتوا */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">
        <BannerHeader
          isNight={isNight}
          CurrentIcon={CurrentIcon}
          muted={muted}
          toggleMute={toggleMute}
          time={time}
        />
        <BannerCenter {...content} />
        <BannerFeatures features={content.features} />
      </div>
    </section>
  );
};

export default React.memo(Banner);
