"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Search, UsersRound, House, StickyNote } from "lucide-react";
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
      <ul className="flex flex-row items-center gap-6">
        {links.map((lnk, idx) => (
          <li key={idx} className=" group list-none">
            <Link
              href={lnk.href}
              className="text-gray-500 font-bold hover:text-gray-800 block py-2"
              onClick={onClick}
            >
              {lnk.title}
            </Link>
            {lnk.subLinks && lnk.subLinks.length > 0 && (
              <div className="absolute right-0 top-full mt-2 min-w-[200px] rounded-md bg-black shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40 border">
                <ul className="p-4 space-y-2">
                  {lnk.subLinks.map((sub, sidx) => (
                    <li key={sidx} className="list-none">
                      <Link
                        href={sub.href}
                        className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm transition-colors block py-1"
                        onClick={onClick}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
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
