"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

const FloatingParticles = ({ isNight, count = 40 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        size: Math.random() * 6 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            isNight ? "bg-yellow-100/40" : "bg-white/50"
          }`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(FloatingParticles);
