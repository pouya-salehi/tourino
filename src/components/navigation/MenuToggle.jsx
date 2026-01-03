"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiMenuFoldLine } from "react-icons/ri";
import { X } from "lucide-react";

export default function MenuToggle({ open, setOpen }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setOpen((p) => !p)}
      className="md:hidden bg-transparent cursor-pointer shadow-none hover:scale-110 transition-transform duration-100 p-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open ? "close" : "menu"}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="flex items-center justify-center"
        >
          {open ? (
            <X size={32} className="text-gray-500 dark:text-white" />
          ) : (
            <RiMenuFoldLine
              size={32}
              className="text-gray-500 dark:text-white"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
