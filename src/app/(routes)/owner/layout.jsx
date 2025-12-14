import Link from "next/link";
import { UsersRound, Megaphone } from "lucide-react";

export default function PanelLayout({ children }) {
  const routes = [
    {
      title: "مدیریت مشتریان",
      icon: <UsersRound />,
      href: "/owner",
    },
    {
      title: "اعمال آگهی",
      icon: <Megaphone />,
      href: "/owner/add-modal",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-fit rounded-md p-2">
        <ul className="flex flex-col gap-2 bg-gradient-to-b rounded-md from-indigo-500 to-purple-500 text-white">
          {routes.map((route) => (
            <li
              key={route.title}
              className="flex flex-col items-center  gap-1 rounded-md p-2 cursor-pointer w-18 transition h-18"
            >
              <Link
                className="flex flex-col items-center w-full h-full justify-center"
                href={route.href}
              >
                {route.icon}
                <span className=" dark:text-white text-xs mt-1 w-full text-center">
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
