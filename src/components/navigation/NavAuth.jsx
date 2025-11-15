"use client";
import Link from "next/link";
//icons
import { LogIn } from "lucide-react";
//auth
import { useAuth } from "@/context/AuthContext";
//ui
import LogoutBtn from "../elements/LogoutBtn";
function NavAuth() {
  const { user, logout, loading } = useAuth();
  return (
    <div>
      {user ? (
        <LogoutBtn loader={loading} signOutHandler={logout} />
      ) : (
        <div className="flex gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all ease-in px-6 py-4 rounded-lg font-semibold text-white text-lg shadow-xl items-center">
          <Link href="/signin" className="flex items-center gap-1">
            <LogIn />
            <span className="hidden sm:inline">ورود</span>
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/signup" className="text-sm">
            ثبت نام
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavAuth;
