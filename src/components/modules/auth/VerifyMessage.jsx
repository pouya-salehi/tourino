// components/modules/auth/VerifyAlert.jsx
"use client";

import { BadgeAlert, CheckCircle2, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
export default function VerifyAlert({ owner, status, onRetry }) {
  // ⚠️ ایمن سازی: اگر owner نبود
  if (!owner) {
    return (
      <div className="p-6 border border-gray-300 rounded-lg text-center">
        <Clock className="mx-auto mb-3 text-gray-500" />
        <h3 className="font-bold text-gray-700">در حال بارگذاری...</h3>
        <p className="text-sm mt-2 text-gray-600">لطفاً صبر کنید</p>
      </div>
    );
  }

  // اولویت‌بندی: از status استفاده کن، اگر نبود از owner.verifyStatus
  const currentStatus = status?.status || owner?.verifyStatus;

  if (currentStatus === "PENDING") {
    return (
      <div className="p-6 border border-yellow-300 rounded-lg bg-yellow-50 text-center">
        <FileText className="mx-auto mb-3 text-yellow-500" size={24} />
        <h3 className="font-bold text-yellow-700">مدارک در حال بررسی است</h3>
        {status?.requestNumber && (
          <p className="text-sm mt-2 text-yellow-600">
            شماره درخواست: {status.requestNumber}
          </p>
        )}
        <p className="text-xs mt-2 text-yellow-500">
          معمولاً ۱ تا ۳ روز کاری طول می‌کشد
        </p>
        <p className="text-sm mt-2 text-red-500 flex items-center gap-0">
          <Dot className="text-red-200" size={40}/>
          لازم به ذکر است که بدون تاییدیه مدارک امکان درج و ثبت تور و هر گونه
          فعالیت، داخل حساب امکان پذیر نیست!
        </p>
      </div>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <div className="p-6 border border-red-300 rounded-lg bg-red-50 text-center">
        <BadgeAlert className="mx-auto mb-3 text-red-500" size={24} />
        <h3 className="font-bold text-red-700">مدارک رد شد</h3>
        <p className="text-sm mt-2 text-red-600">
          {status?.adminNote || "لطفاً مدارک معتبر ارسال کنید"}
        </p>
        <p className="text-xs mt-2 text-red-500">
          برای حل مشکل می‌توانید با پشتیبانی تماس بگیرید
        </p>

        {onRetry && (
          <Button
            variant="outline"
            className="mt-4 bg-white border-red-300 text-red-600 hover:bg-red-50"
            onClick={onRetry}
          >
            ارسال مجدد مدارک
          </Button>
        )}
      </div>
    );
  }

  if (currentStatus === "APPROVED") {
    return (
      <div className="p-6 border border-green-300 rounded-lg bg-green-50 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-green-500" size={24} />
        <h3 className="font-bold text-green-700">احراز هویت تایید شد</h3>
        <p className="text-sm text-green-600">
          خوش آمدید {owner?.name || "کاربر"}
        </p>
        <p className="text-xs mt-2 text-green-500">
          اکنون می‌توانید از تمام امکانات سامانه استفاده کنید
        </p>
      </div>
    );
  }

  // حالت پیش‌فرض: اگر هنوز اطلاعاتی ثبت نشده
  return (
    <div className="p-6 border border-blue-300 rounded-lg bg-blue-50 text-center">
      <FileText className="mx-auto mb-3 text-blue-500" size={24} />
      <h3 className="font-bold text-blue-700">هنوز مدارک ارسال نکرده‌اید</h3>
      <p className="text-sm mt-2 text-blue-600">
        برای شروع فعالیت، لطفاً مدارک خود را ارسال کنید
      </p>
      {onRetry && (
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={onRetry}
        >
          شروع فرآیند احراز هویت
        </Button>
      )}
    </div>
  );
}
