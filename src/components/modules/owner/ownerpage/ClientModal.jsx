"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Check, X, User, FileBadge } from "lucide-react";

export default function ClientModal({ open, onClose, user, documents }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [rejectReason, setRejectReason] = useState("");

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl p-0 bg-white backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-10 border-b border-white/40">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            {user.name || "بدون نام"}
          </DialogTitle>
        </DialogHeader>
        {/* Tabs */}
        <div className="flex border-b border-white/40">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-center font-medium transition ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md"
                : "hover:bg-blue-50"
            }`}
          >
            اطلاعات کاربر
          </button>

          <button
            onClick={() => setActiveTab("verify")}
            className={`flex-1 py-3 text-center font-medium transition ${
              activeTab === "verify"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md"
                : "hover:bg-blue-50"
            }`}
          >
            مدارک احراز هویت
          </button>
        </div>
        {/* Content */}
        <div className="p-6 max-h-screen overflow-y-auto">
          {/* ---------------- PROFILE TAB ---------------- */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-5">
                <img
                  src={user.avatar || "/fallback-avatar.png"}
                  className="w-20 h-20 object-cover rounded-full border shadow"
                />
                <div>
                  <p className="text-xl font-bold">{user.name || "بدون نام"}</p>
                  <p className="text-gray-600">{user.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="اسلاگ" value={user.slug} />
                <Field label="شهر" value={user.city} />
                <Field label="نقش کاربر" value={user.role} />
                <Field label="وضعیت احراز هویت" value={user.verifyStatus} />
                <Field
                  label="پروفایل تکمیل شده"
                  value={user.profileCompleted ? "بله" : "خیر"}
                />
                <Field label="کد ملی" value={user.nationalCode} />
                <Field label="شماره مجوز" value={user.licenseNumber} />
              </div>

              {user.bio && (
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <p className="font-semibold mb-2">بیوگرافی:</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ---------------- VERIFY TAB ---------------- */}
          {activeTab === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              {/* Document Cards */}
              <DocCard title="کارت ملی" src={documents?.nationalCard} />
              <DocCard title="مجوز کسب" src={documents?.licenseImage} />

              <Field label="وضعیت مدارک" value={documents?.status} />

              {/* Reject Reason */}
              <div>
                <label className="font-semibold">دلیل رد (اختیاری)</label>
                <Input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="اگر قصد رد دارید، دلیل را وارد کنید..."
                  className="mt-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Check className="w-5 h-5 ml-2" />
                  تایید مدارک
                </Button>

                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  <X className="w-5 h-5 ml-2" />
                  رد مدارک
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------ COMPONENTS ------------------------ */

function Field({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border">
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-gray-800">{value || "—"}</p>
    </div>
  );
}

function DocCard({ title, src }) {
  return (
    <div className="rounded-xl overflow-hidden border shadow-sm bg-white">
      <div className="p-3 border-b flex items-center gap-2">
        <FileBadge className="w-5 h-5 text-blue-600" />
        <p className="font-semibold">{title}</p>
      </div>

      {src ? (
        <img src={src} className="w-full max-h-72 object-cover" />
      ) : (
        <div className="p-6 text-center text-gray-400">تصویری ثبت نشده</div>
      )}
    </div>
  );
}
