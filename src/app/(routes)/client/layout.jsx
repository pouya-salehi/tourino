"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { UserRound, Info, Search } from "lucide-react";

export default function ClientLayout({ children }) {
  const routes = [
    {
      title: "توور های شما",
      icon: <UserRound />,
      href: "/",
    },
    {
      title: "تکمیل اطلاعات شخصی",
      icon: <Info />,
      href: "/",
    },
    {
      title: "جستجوی تور",
      icon: <Search />,
      href: "/tours",
    },
  ];
  return (
    <div className="min-h-screen flex">
      <aside className="w-full md:w-fit rounded-md p-0 fixed bottom-0 right-0 z-50 shadow-[0px_-4px_10px_0px_rgba(0,_0,_0,_0.1)] md:shadow-none md:relative md:p-2">
        <ul className="flex flex-row md:flex-col gap-2 dark:bg-background bg-white md:bg-gradient-to-b rounded-t-md md:rounded-md from-indigo-500 to-purple-500 text-white">
          {routes.map((route) => (
            <li
              key={route.title}
              className="relative flex flex-col items-center gap-1 rounded-md p-4 md:p-2 cursor-pointer w-full md:h-18"
            >
              <Link
                className="flex flex-col items-center w-full h-full justify-center text-gray-500 md:text-white"
                href={route.href}
              >
                {route.icon}
                <span className="dark:text-white text-xs mt-1 w-full text-center hidden md:block">
                  {route.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="sm:px-6 lg:px-8 w-full">{children}</main>
    </div>
  );
}
