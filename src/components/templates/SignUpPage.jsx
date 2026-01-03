//SignupPage
"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// toast
import { toast } from "@/components/toast";

// helper
import { normalizePhone } from "@/app/helper/phone";

// components
import SelectRole from "../modules/signup/SelectRole";
export default function SignUpPage() {
  const [step, setStep] = useState(1);

  const [role, setRole] = useState(""); // NEW
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [slugStatus, setSlugStatus] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef(null);
  const router = useRouter();

  // ** check slug **
  const checkSlug = useCallback(async (value) => {
    if (!value.trim()) {
      setSlugStatus(null);
      setCheckingSlug(false);
      return;
    }

    setCheckingSlug(true);
    console.log("🔄 Checking slug for:", value);

    try {
      const res = await fetch("/api/auth/check-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      });

      console.log("📡 API Response status:", res.status);

      const data = await res.json();
      console.log("📦 API Response data:", data);

      setSlugStatus(data);
    } catch (error) {
      console.log("🚨 Error checking slug:", error);
      setSlugStatus({ available: false, message: "خطا" });
    } finally {
      setCheckingSlug(false);
    }
  }, []);
  const handleTitleChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setTitle(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.trim().length > 0) checkSlug(value);
    }, 600);
  };

  // ** send OTP **
  const sendOtp = async () => {
    if (!role) return toast.error("نوع حساب را مشخص کنید");
    if (!name) return toast.error("نام و نام خانوادگی را وارد کنید");
    if (!phone) return toast.error("شماره موبایل را وارد کنید");

    // اگر صاحب تور است → title باید باشد
    if (role === "OWNER") {
      if (!title) return toast.error("عنوان تور لازم است");
      if (slugStatus && !slugStatus.available)
        return toast.error("عنوان تور قبلاً انتخاب شده");
    }

    setLoading(true);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        phone: normalizePhone(phone),
        name,
        title: role === "OWNER" ? title : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return toast.error(data.message);

    toast.success("کد ارسال شد");
    setStep(2);
  };

  // ** verify OTP **
  const verifyOtp = async () => {
    if (otp.length !== 6) return toast.error("کد ۶ رقمی را وارد کنید");

    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: normalizePhone(phone),
        otp,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return toast.error(data.message);

    toast.success("ثبت‌نام انجام شد ✔");
    router.push(data.redirect);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            {step === 1 ? "ثبت‌نام" : "تایید کد"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              {/* انتخاب نقش */}
              <SelectRole value={role} onChange={setRole} />

              <Input
                placeholder="نام و نام خانوادگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* فقط اگر owner بود */}
              {role === "OWNER" && (
                <div className="relative flex items-center">
                  <Input
                    placeholder="عنوان تور (لاتین)"
                    value={title}
                    onChange={handleTitleChange}
                    className={` ${
                      slugStatus?.available
                        ? "border-green-500"
                        : slugStatus && !slugStatus.available
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {checkingSlug && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {slugStatus?.available && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {slugStatus && !slugStatus.available && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              )}

              <Input
                placeholder="شماره موبایل"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Separator />

              <Button
                className="w-full"
                disabled={loading || checkingSlug}
                onClick={sendOtp}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ارسال کد تایید"
                )}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="کد ۶ رقمی"
                className="text-center tracking-[8px] text-xl"
              />

              <Separator />

              <Button className="w-full" onClick={verifyOtp} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "تایید کد"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                بازگشت
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
