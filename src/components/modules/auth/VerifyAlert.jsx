"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BadgeAlert, Download, FileText, CheckCircle2 } from "lucide-react";

export default function VerificationFlow({ owner }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // اصلاح اسم state
  const [profileData, setProfileData] = useState({
    fullName: owner.name || "",
    phone: owner.phone || "",
    nationalCode: "",
    licenseNumber: "",
  });

  const [canDownload, setCanDownload] = useState(false);

  // چک کامل بودن فرم
  useEffect(() => {
    const { fullName, phone, nationalCode, licenseNumber } = profileData;
    setCanDownload(
      fullName && phone && nationalCode.length === 10 && licenseNumber
    );
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ذخیره پروفایل
  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/owner/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 اضافه شد – بدون این کوکی نمی‌ره
        body: JSON.stringify({
          slug: owner.slug,
          ...profileData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "خطا در ذخیره اطلاعات");
        return;
      }

      toast.success("اطلاعات با موفقیت ذخیره شد");
      setStep(2);
    } catch (error) {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  // ارسال فایل‌ها
  const submitVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      formData.append("slug", owner.slug);

      const res = await fetch("/api/owner/submit-verification", {
        method: "POST",
        body: formData,
        credentials: "include", // ✅ این خط رو اضافه کن
      });

      const data = await res.json();

      if (data.success) {
        toast.success("مدارک با موفقیت ارسال شد");
        setStep(4);
      } else {
        toast.error(data.message || "خطا در ارسال مدارک");
      }
    } catch (error) {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };
  /* ------------------------------------
     مرحله 1 : تکمیل پروفایل
  ------------------------------------*/
  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeAlert className="h-5 w-5" />
            تکمیل اطلاعات هویتی
          </CardTitle>
          <CardDescription>
            لطفاً اطلاعات هویتی خود را تکمیل کنید
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نام و نام خانوادگی</Label>
              <Input
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="نام کامل"
              />
            </div>

            <div className="space-y-2">
              <Label>شماره موبایل</Label>
              <Input
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="09xxxxxxxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>کد ملی</Label>
              <Input
                value={profileData.nationalCode}
                onChange={(e) =>
                  handleInputChange(
                    "nationalCode",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                placeholder="۱۰ رقمی"
              />
            </div>

            <div className="space-y-2">
              <Label>شماره پروانه کسب</Label>
              <Input
                value={profileData.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
                placeholder="شماره پروانه"
              />
            </div>
          </div>

          <Button
            onClick={saveProfile}
            disabled={!canDownload || loading}
            className="w-full"
          >
            {loading ? "در حال ذخیره..." : "ذخیره اطلاعات"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------------------
     مرحله 2 : دانلود تعهدنامه
  ------------------------------------*/
  if (step === 2) {
    return (
      <Card className="w-full max-w-2xl bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            دانلود تعهدنامه
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <a href={`/api/generate-contract?slug=${owner.slug}`} download>
              <Download className="h-4 w-4" />
              دریافت تعهدنامه
            </a>
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setStep(3)}
          >
            ادامه
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------------------
     مرحله 3 : ارسال مدارک
  ------------------------------------*/
  if (step === 3) {
    return (
      <Card className="w-full max-w-2xl bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ارسال مدارک
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitVerification} className="space-y-4">
            <div className="space-y-2">
              <Label>تصویر تعهدنامه امضا شده</Label>
              <Input
                name="signedContract"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>مدارک اضافی (اختیاری)</Label>
              <Input
                name="additionalDocs"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ارسال..." : "ارسال برای بررسی"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------------------
     مرحله 4 : نهایی
  ------------------------------------*/
  return (
    <Card className="w-full max-w-2xl border-green-300">
      <CardContent className="pt-6 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        <h3 className="text-xl font-semibold text-green-700 mb-2">
          مدارک با موفقیت ارسال شد
        </h3>

        <p className="text-green-600 text-sm">
          نتیجه بررسی از طریق پنل به شما اعلام می‌شود.
        </p>
      </CardContent>
    </Card>
  );
}
