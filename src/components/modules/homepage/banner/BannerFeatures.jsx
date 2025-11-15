"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const BannerFeatures = ({ features }) => {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 md:gap-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-xl text-sm md:text-base border border-white/30"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="font-semibold">{feature}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BannerFeatures;
