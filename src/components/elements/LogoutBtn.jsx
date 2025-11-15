"use client";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { LogOut } from "lucide-react";
export default function LogoutBtn() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/signin";
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center border-2 border-white rounded-md p-2 font-bold gap-2 cursor-pointer"
    >
      {loading ? (
        <BeatLoader size={8} color="#fcfcfc" />
      ) : (
        <span className="flex items-center gap-2">
          <LogOut />
          خروج از حساب کاربری
        </span>
      )}
    </button>
  );
}
