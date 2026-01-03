"use client";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { e2p } from "@/lib/replaceNumber";
import {
  UserRound,
  LogOut,
  Mail,
  LogIn,
  FileInput,
  House,
  CircleUserRound,
  Tent,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
export default function UserMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/signin";
  };

  useEffect(() => {
    function close(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const getPanel = () => {
    if (!user) return "/signin";
    if (user.role === "CLIENT") return "/client";
    if (user.role === "ADMIN") return `/${user.slug}/panel`;
    if (user.role === "OWNER") return "/owner";
    return "/client";
  };
  return (
    <>
      {!user && (
        <Button className="flex items-center gap-2">
          <Link href="/signin" className="flex items-center gap-1">
            <LogIn size={18} />
            ورود
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/signup" className="flex items-center gap-1">
            <FileInput size={18} />
            ثبت نام
          </Link>
        </Button>
      )}

      <div ref={menuRef}>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full p-4 cursor-pointer"
                onClick={() => setOpen((v) => !v)}
              >
                <UserRound size={22} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent open={open} align="end" className="w-64">
              <div className="flex justify-between items-center px-2 text-gray-500 dark:text-white text-xs">
                <DropdownMenuLabel>{e2p(user.phone)}</DropdownMenuLabel>
                <DropdownMenuLabel className="opacity-70">
                  <h2>
                    {user.role === "OWNER" ? (
                      <span>مدیرعامل</span>
                    ) : user.role === "ADMIN" ? (
                      <span>صاحب تور</span>
                    ) : (
                      <span>مشتری</span>
                    )}
                  </h2>
                </DropdownMenuLabel>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    href={getPanel()}
                    className="flex items-center py-2 gap-2"
                  >
                    <CircleUserRound size={18} />
                    حساب کاربری
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    href={`/${user.slug}`}
                    className="flex items-center py-2 gap-2"
                  >
                    <Tent size={18} />
                    برو به صفحه اصلی تور
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/" className="flex items-center py-2 gap-2">
                    <House size={18} />
                    صفحه اصلی
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    href={`/${user.slug}/panel/messages`}
                    className="flex items-center py-2 gap-2"
                  >
                    <div>
                      <Mail size={18} className="relative" />
                      <span className="w-2 h-2 rounded-full bg-red-500 absolute top-4 left-2"></span>
                    </div>
                    پیام های دریافتی
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuItem onClick={handleLogout}>
                <span className="flex py-2 gap-2 items-center text-red-600 cursor-pointer">
                  <LogOut size={18} color="#EE4B2B" />
                  خروج
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
}
