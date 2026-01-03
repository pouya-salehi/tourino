"use client";
import { motion, AnimatePresence } from "framer-motion";
import NavLinks from "./NavLinks";
import { Separator } from "@radix-ui/react-dropdown-menu";
//logo
import GoToTourLogo from "../logo/GototourLogo";
import NavMobileFooter from "../logo/NavMobileFooter";
export default function NavMobile({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 28,
            }}
            className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#21242a] z-50 p-6 md:hidden"
          >
            <NavLinks mobile onClick={onClose} />
            <GoToTourLogo />
            <NavMobileFooter />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
