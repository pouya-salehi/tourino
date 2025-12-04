"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, LogIn, FileInput } from "lucide-react";
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
    if (user.role === "client") return "/client";
    if (user.role === "owner") return `/${user.slug}/panel`;
    if (user.role === "admin") return "/owner";
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
                className="rounded-full p-4"
                onClick={() => setOpen((v) => !v)}
              >
                <User size={22} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent open={open} align="end" className="w-64">
              <div className="flex justify-between items-center px-2">
                <DropdownMenuLabel>{user.phone}</DropdownMenuLabel>
                <DropdownMenuLabel className="opacity-70">
                  {user.role}
                </DropdownMenuLabel>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href={getPanel()} className="flex items-center gap-2">
                    <Settings size={18} />
                    حساب کاربری
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <span className="flex gap-2 items-center text-red-600">
                  <LogOut size={18} />
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
