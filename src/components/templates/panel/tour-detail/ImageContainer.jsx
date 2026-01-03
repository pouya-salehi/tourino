"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
const AUTO_DELAY = 3000;

export default function ImageContainer({ images = [] }) {
  const [index, setIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const timeoutRef = useRef(null);

  const count = images.length;

  // ===============================
  // Detect Desktop / Mobile (inside component)
  // ===============================
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const update = () => setIsDesktop(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // ===============================
  // Desktop Auto Slider
  // ===============================
  useEffect(() => {
    if (!isDesktop || count <= 1) return;

    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % count);
    }, AUTO_DELAY);

    return () => clearTimeout(timeoutRef.current);
  }, [index, isDesktop, count]);

  // ===============================
  // Mobile Swipe Logic
  // ===============================
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -80 && index < count - 1) {
      setIndex(index + 1);
    }
    if (info.offset.x > 80 && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ================= Image ================= */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          drag={!isDesktop ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.02 },
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src={images[index]}
            className="w-full h-full object-cover scale-110 shadow-xl"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* ================= Mobile Overlay Hint ================= */}
      {!isDesktop && count > 1 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 0, 1, 0, 1, 0],
              x: [0, 0, 0, 0, 0, 0, 40], // خروج نرم به راست
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
            }}
            className="bg-black/40 backdrop-blur px-4 py-2 rounded-full text-white text-sm flex items-center gap-1"
          >
            <ChevronRight />
            صفحه را بکشید
          </motion.div>
        </div>
      )}

      {/* ================= Counter (1 / N) ================= */}
      {count > 1 && (
        <div className="absolute bottom-8 left-8 bg-black/40 backdrop-blur text-white flex items-center justify-center text-xs px-4 py-2 rounded-full">
          {index + 1} / {count}
        </div>
      )}

      {/* ================= Progress Lines ================= */}
      {count > 1 && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] bg-white/40 rounded overflow-hidden"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{
                  width: i === index ? "100%" : "0%",
                }}
                transition={{
                  duration: isDesktop && i === index ? 3 : 0.25,
                  ease: "linear",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
