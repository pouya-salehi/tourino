"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
export default function AnnouncementModal() {
  const [modal, setModal] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetch("/api/owner/modals")
      .then((res) => res.json())
      .then((data) => {
        const active = data.data.find(
          (m) => new Date(m.expiresAt) > new Date()
        );
        setModal(active || null);
      });
  }, []);

  if (!modal || !open) return null;

  // ⭐ انیمیشن کاملاً حرفه‌ای و درست‌شده
  const animations = {
    fade: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    "slide-up": {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -40 },
      animate: { opacity: 1, y: 0 },
    },
    "zoom-in": {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const currentAnim = animations[modal.animation] || animations.fade;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={currentAnim.initial}
        animate={currentAnim.animate}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="
          w-[420px] p-7 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.45)]
          text-white relative text-center border border-white/10
        "
        style={{
          background:
            modal.backgroundType === "image"
              ? `url(${modal.backgroundValue}) center/cover`
              : modal.backgroundValue,
        }}
      >
        {/* دکمه بستن */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full
          bg-white/20 backdrop-blur-sm flex items-center justify-center
          hover:bg-white/40 transition-all cursor-pointer"
        >
          <X className="text-white" size={20} />
        </button>

        {/* درصد تخفیف */}
        {modal.couponPercentage > 0 && (
          <h1 className="text-6xl font-extrabold drop-shadow-xl tracking-tight">
            {modal.couponPercentage}%
          </h1>
        )}

        {/* عنوان */}
        <h2 className="text-2xl mt-4 font-bold drop-shadow-lg">
          {modal.title}
        </h2>

        {/* دکمه CTA */}
        <Link
          href="/tours"
          className="mt-6 inline-block bg-white/90 text-black 
          px-5 py-2.5 rounded-xl font-bold backdrop-blur-sm
          hover:bg-white transition-all"
        >
          مشاهده تورها
        </Link>
      </motion.div>
    </div>
  );
}
