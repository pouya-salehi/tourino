"use client";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  House,
  Settings,
  PanelsTopLeft,
  MonitorCog,
  CircleAlert,
  Image,
  Tent,
  List,
} from "lucide-react";
import { motion } from "framer-motion";
export default function PanelLayout({ children }) {
  const { slug } = useParams();
  const { user } = useAuth();

  const routes = [
    {
      title: "خانه",
      icon: <House />,
      href: `/${slug}/panel`,
      roles: ["OWNER", "ADMIN"],
    },
    {
      title: "افزودن تور",
      icon: <Tent />,
      href: `/${slug}/panel/add-tour`,
      roles: ["OWNER"],
    },
    {
      title: "لیست تورها",
      icon: <List />,
      href: `/${slug}/panel/tours`,
      roles: ["OWNER", "ADMIN"],
    },

    {
      title: "تنظیمات",
      icon: <Settings />,
      href: `/${slug}/panel/setting`,
      roles: ["OWNER"], // ❌ ادمین نبینه
    },
    {
      title: "ویرایش عکس",
      icon: <Image />,
      href: `/${slug}/panel/edit-image`,
      roles: ["OWNER"],
    },
  ];
  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(user?.role)
  );
  return (
    <div className="min-h-screen flex py-14">
      <aside className="w-full md:w-fit rounded-md p-0 fixed bottom-0 right-0 z-50 shadow-[0px_-4px_10px_0px_rgba(0,_0,_0,_0.1)] md:shadow-none md:relative md:p-2">
        <ul className="flex flex-row md:flex-col gap-2 bg-white dark:bg-background md:bg-gradient-to-b rounded-t-md md:rounded-md from-indigo-500 to-purple-500 text-white">
          {filteredRoutes.map((route) => (
            <motion.li
              key={route.title}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex flex-col items-center gap-1 rounded-md p-4 md:p-2 cursor-pointer w-full md:h-18"
            >
              <Link
                href={route.href}
                className="flex flex-col items-center w-full h-full justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-gray-500 dark:text-white md:text-white"
                >
                  {route.icon}
                </motion.div>

                <span className="text-xs mt-1 w-14 text-center md:w-full hidden md:block">
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
