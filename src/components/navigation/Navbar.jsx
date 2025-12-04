"use client";
import NavLinks from "./NavLinks";
import UserMenu from "./NavAuth";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center p-4">
      <div>
        <NavLinks />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="bg-transparent cursor-pointer shadow-none hover:scale-110 transition-transform duration-200 p-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                duration: 0.1,
              }}
              className="flex items-center justify-center"
            >
              {theme === "light" ? (
                <Sun size={22} className="text-amber-500" />
              ) : (
                <Moon size={22} className="text-indigo-300" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        <UserMenu />
      </div>
    </nav>
  );
}

export default Navbar;
