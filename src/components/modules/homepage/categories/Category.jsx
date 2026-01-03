"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Category() {
  const categories = [
    { title: "تور های کمپینگ", img: "./images/5.png" },
    { title: "تور های سافاری", img: "./images/4.png" },
    { title: "تور های کوهنوردی", img: "./images/1.png" },
    { title: "تور های صخره نوردی", img: "./images/2.png" },
    { title: "تور های رفتینگ", img: "./images/6.png" },
    { title: "تور های مسافرتی", img: "./images/3.png" },
  ];

  const STEP = 2;
  const COLLAPSE_STEP = 4;

  const [visibleCount, setVisibleCount] = useState(STEP);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(media.matches);

    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const visibleCategories = isMobile
    ? categories.slice(0, visibleCount)
    : categories;

  const isAllVisible = visibleCount >= categories.length;
  const canCollapse = visibleCount > STEP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="p-0 md:p-4 relative"
    >
      <div className="">
        <motion.ul
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence>
            {visibleCategories.map((c) => (
              <motion.li
                key={c.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                className="shadow rounded-4xl flex p-4 relative h-72 mt-6 dark:shadow-none dark:border-none"
              >
                <div className="flex flex-col justify-end items-center w-full md:justify-between h-full md:w-fit">
                  <span className="text-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text flex">
                    <Quote
                      size={16}
                      className="text-black/50"
                      fill="#00d1d1"
                      strokeWidth={0}
                    />
                    {c.title}
                    <Quote
                      size={16}
                      className="text-black/50 rotate-180"
                      fill="#00d1d1"
                      strokeWidth={0}
                    />
                  </span>
                  <Button className="w-3xs cursor-pointer bg-transparent text-gray-500">
                    رزرو تور
                  </Button>
                </div> 

                <div className="w-44 md:w-2xs absolute -top-12 left-20 md:-left-10">
                  <img src={c.img} alt="" />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* گرادیانت فقط وقتی آیتم مخفی داریم */}
        {isMobile && !isAllVisible && (
          <div className="pointer-events-none absolute bottom-16 left-0 w-full h-40 bg-gradient-to-t from-white/80 via-white/60 dark:from-black dark:via-black/50 to-transparent rounded-4xl" />
        )}
      </div>

      {/* کنترل‌ها – فقط موبایل */}
      {isMobile && (
        <div className="flex justify-center gap-4 mt-6">
          {!isAllVisible && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              onClick={() => setVisibleCount((p) => p + STEP)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
            >
              نمایش بیشتر
            </motion.button>
          )}

          {isAllVisible && canCollapse && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              onClick={() =>
                setVisibleCount((p) => Math.max(STEP, p - COLLAPSE_STEP))
              }
              className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300 shadow"
            >
              پنهان کردن
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Category;
