"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// helpers
import { normalizePhone } from "@/app/helper/phone";
// toast custom
import { toast } from "@/components/toast";
export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("کد ارسال شد");
        setStep(2);
      } else {
        toast.error(json.message || "خطا در ارسال کد");
      }
    } catch {
      toast.error("خطا در ارسال");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone), otp }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message);
        return;
      }

      toast.success("ورود موفق");
      router.push(json.redirect);
    } catch (err) {
      toast.error("خطای اتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            {step === 1 ? "ورود صاحب تور" : "تایید کد ارسال شده"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="شماره تلفن"
                className="w-full"
              />
              <Separator />

              <Button onClick={sendOtp} disabled={loading} className="w-full">
                {loading ? "در حال ارسال..." : "ارسال کد تایید"}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Input
                placeholder="کد ۶ رقمی"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center tracking-[8px] text-xl"
              />

              <Separator />

              <Button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-2"
              >
                {loading ? "در حال بررسی..." : "تایید کد"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full"
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
