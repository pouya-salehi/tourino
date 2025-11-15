"use client";
import { motion } from "framer-motion";

export default function BorderFrame({ children }) {
  return (
    <div className="relative">
      {/* بالا راست */}
      <motion.div
        initial={{ width: 0, height: 0 }}
        animate={{ width: "60px", height: "60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 right-0 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"
      />

      {/* پایین چپ */}
      <motion.div
        initial={{ width: 0, height: 0 }}
        animate={{ width: "60px", height: "60px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-0 left-0 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"
      />

      {/* محتوای اصلی */}
      <div className="z-10 p-6">{children}</div>
    </div>
  );
}
