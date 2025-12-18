"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  House,
  Settings,
  PanelsTopLeft,
  MonitorCog,
  CircleAlert,
  Image,
  Tent
} from "lucide-react";
import { motion } from "framer-motion";
export default function PanelLayout({ children }) {
  const { slug } = useParams();

  const routes = [
    {
      title: "خانه",
      icon: <House />,
      href: `/${slug}/panel`,
    },
    {
      title: "افزودن تور",
      icon: <PanelsTopLeft />,
      href: `/${slug}/panel/add-tour`,
    },
    {
      title: "لیست تورها",
      icon: <Tent />,
      href: `/${slug}/panel/tours`,
    },
    {
      title: "مشاهده حساب",
      icon: <MonitorCog />,
      href: `/${slug}`,
    },
    {
      title: "تکمیل اطلاعات",
      icon: <CircleAlert />,
      href: `/${slug}/panel/personal-details`,
    },
    {
      title: "تنظیمات",
      icon: <Settings />,
      href: `/${slug}/panel/setting`,
    },
    {
      title: "ویرایش عکس",
      icon: <Image />,
      href: `/${slug}/panel/edit-image`,
    },
  ];

  return (
    <div className="min-h-screen flex py-14">
      <aside className="w-fit rounded-md p-2">
        <ul className="flex flex-col gap-2 bg-gradient-to-b rounded-md from-indigo-500 to-purple-500 text-white">
          {routes.map((route) => (
            <motion.li
              key={route.title}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex flex-col items-center gap-1 rounded-md p-2 cursor-pointer h-18"
            >
              <Link
                href={route.href}
                className="flex flex-col items-center w-full h-full justify-center"
              >
                {/* آیکن */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {route.icon}
                </motion.div>

                {/* عنوان */}
                <span className="text-xs mt-1 w-full text-center dark:text-white">
                  {route.title}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </aside>

      <main className="sm:px-6 lg:px-8 w-full">{children}</main>
    </div>
  );
}
