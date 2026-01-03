"use client";
import { useState } from "react";
import NavLinks from "./NavLinks";
import UserMenu from "./NavAuth";
import GoToTour from "./GoToTour";
import NavMobile from "./NavMobile";
import { Sun, Moon, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenuSearchLine, RiMenuFoldLine } from "react-icons/ri";
import { FiShoppingBag } from "react-icons/fi";
//Components
import MenuToggle from "./MenuToggle";
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full bg-white/90 dark:bg-[#21242a] p-4 transition-all duration-500">
        {/* Desktop NavLinks */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <MenuToggle open={open} setOpen={setOpen} />

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
                }}
              >
                {theme === "light" ? (
                  <Sun size={26} className="text-amber-500" />
                ) : (
                  <Moon size={26} className="text-indigo-50" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          <Button className="text-gray-500 bg-transparent dark:text-white">
            <FiShoppingBag size={26} />
          </Button>

          <div className="flex items-center">
            {/* <GoToTour /> */}
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <NavMobile open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default Navbar;
