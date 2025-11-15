"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BannerCenter = ({ title, subtitle, desc, cta }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-16">
      <motion.h1
        className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight whitespace-pre"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-white/90 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="max-w-2xl mx-auto text-white/80 mt-4 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {desc}
      </motion.p>

      <motion.button
        className="relative bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg mt-8 overflow-hidden"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 flex items-center gap-2">
          {cta}
          <ArrowRight />
        </span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </motion.button>
    </div>
  );
};

export default BannerCenter;
