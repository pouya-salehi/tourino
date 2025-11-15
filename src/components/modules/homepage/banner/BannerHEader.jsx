"use client";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const BannerHeader = ({ isNight, CurrentIcon, muted, toggleMute, time }) => {
  const timeString = time.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex justify-between items-center">
      {/* برند */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div
          className={`p-3 rounded-2xl backdrop-blur-md ${
            isNight ? "bg-white/10" : "bg-black/10"
          }`}
        >
          <CurrentIcon className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-lg">Adventure Tours</div>
          <div className="text-sm opacity-80">
            {isNight ? "🌙 شب آرام" : "☀️ روز روشن"}
          </div>
        </div>
      </motion.div>

      {/* کنترل‌ها */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={toggleMute}
          className={`p-3 rounded-2xl backdrop-blur-md ${
            isNight ? "bg-white/10" : "bg-black/10"
          }`}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="text-sm font-semibold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          {timeString}
        </div>
      </motion.div>
    </div>
  );
};

export default BannerHeader;
