"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Search, UsersRound, House, StickyNote } from "lucide-react";
import { Separator } from "../ui/separator";
export default function NavLinks({ onClick, mobile = false }) {
  const router = useRouter();

  const links = [
    { href: "/", label: "خانه", title: "خانه", icon: <House size={30} /> },
    {
      href: "/about",
      label: "درباره ما",
      title: "درباره ما",
      icon: <StickyNote size={30} />,
      subLinks: [{ href: "/about", label: "تماس با ما", title: "تماس با ما" }],
    },
  ];

  if (mobile) {
    return (
      <ul className="flex flex-col gap-6">
        {links.map((lnk, idx) => (
          <li key={idx} className="group px-2 list-none">
            <Link
              href={lnk.href}
              className="text-gray-500 font-bold hover:text-gray-800 block py-2"
              onClick={onClick}
            >
              {lnk.title}
            </Link>
          </li>
        ))}
        <Separator />
        {/* 👇 فقط برای موبایل */}
        <li className="flex flex-col gap-2 mt-4">
          <Button
            href="/profiles"
            className="cursor-pointer bg-white text-gray-500"
            onClick={onClick}
          >
            <UsersRound />
            <Link href="/profiles">پروفایل کاربران</Link>
          </Button>

          <Button
            href="/tours"
            className="cursor-pointer px-8"
            onClick={onClick}
          >
            <Search />
            <Link href="/tours">جستجوی تور</Link>
          </Button>
        </li>
      </ul>
    );
  }

  return (
    <div className="flex items-center gap-8 px-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          data-testid={`navlink-${link.label}`}
          className="menu-link transition-colors duration-200  flex items-center justify-center text-gray-900 dark:text-white"
        >
          {link.label}
        </Link>
      ))}
      <div className="flex gap-2">
        <Button href="/tours" className="cursor-pointer bg-white text-gray-500">
          <UsersRound />
          <Link href="/profiles">پروفایل کاربران</Link>
        </Button>
        <Button href="/tours" className="cursor-pointer px-8">
          <Search />
          <Link href="/tours">جستجوی تور</Link>
        </Button>
      </div>
    </div>
  );
}
