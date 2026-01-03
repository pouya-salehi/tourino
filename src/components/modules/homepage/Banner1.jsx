"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
function Banner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
      }}
      className="text-center md:text-start flex items-center justify-between w-full gap-8 mt-16 h-[60vh] md:h-[80vh] rounded-4xl dark:shadow-none dark:border-none md:shadow-lg shadow-none"
    >
      {/* متن */}
      <div className="w-full flex flex-col items-center">
        <div className="bannerBackground bg-[#f2f8fc]/20 absolute w-2xl h-120 shadow right-20 top-40 dark:bg-transparent dark:shadow-2xl hidden md:block" />
        <div className="relative">
          <h1 className="text-2xl md:text-7xl font-extrabold leading-snug md:leading-tight mb-6 text-gray-700 dark:text-white">
            کوله‌پشتیتو ببند؛
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 text-transparent bg-clip-text">
              همسفرهاشو من پیدا می‌کنم!
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <Button
              href="/tours"
              className="cursor-pointer bg-white text-gray-500"
            >
              <Link href="signup">حساب کاربری نداری؟</Link>
            </Button>
            <Button href="/tours" className="cursor-pointer px-8">
              <Search />
              <Link href="/tours">جستجوی تور</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* تصویر + سایه */}
      <motion.div
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-1/2 hidden md:block"
      >
        {/* تصویر */}
        <img
          src="./images/banner.png"
          alt="banner"
          className="relative z-10 "
        />

        {/* سایه زیر تصویر */}
        <div
          className="
            absolute
            -bottom-6
            left-1/2
            -translate-x-1/2
            w-[90%]
            h-6
            bg-black/50
            dark:bg-white/20
            dark:h-4
            blur-xl
            rounded-full
            scale-x-110
          "
        />
      </motion.div>
    </motion.div>
  );
}

export default Banner;
