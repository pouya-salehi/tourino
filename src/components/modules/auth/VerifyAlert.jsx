"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import VerifyAlert from "./VerifyMessage";
import AuthenticationInfo from "./auth-steps/AuthenticationInfo";
import ContractDownload from "./auth-steps/ContractDownload";
import SendInfo from "./auth-steps/SendInfo";

export default function VerificationFlow({ owner }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasFetchedStatus, setHasFetchedStatus] = useState(false); // ✅ حل loop

  const [profileData, setProfileData] = useState({
    fullName: owner?.name || "",
    phone: owner?.phone || "",
    nationalCode: "",
    licenseNumber: "",
  });

  const [files, setFiles] = useState({
    signedContract: null,
    nationalCard: null,
    licenseImage: null,
    additionalDocs: [],
  });

  /* ===============================
      Step Decision Logic - اصلاح شده
  =============================== */
  const determineStep = useCallback((verificationData, user) => {
    if (!user) return 1;

    // اگر تایید شده
    if (user.verifyStatus === "APPROVED") {
      return 4;
    }

    // اگر در حال بررسی
    if (verificationData?.status === "PENDING") {
      return 4;
    }

    // اگر رد شده
    if (verificationData?.status === "REJECTED") {
      return 3; // برو به مرحله ارسال مجدد
    }

    // اگر پروفایل کامل شده
    if (user.profileCompleted) {
      // چک کن اگر مدارک ارسال شده
      if (verificationData?.status === "NOT_SUBMITTED") {
        return 2; // برو به دانلود قرارداد
      }
      return 2;
    }

    // پیش‌فرض: مرحله 1 (تکمیل پروفایل)
    return 1;
  }, []);

  /* ===============================
      Validation
  =============================== */
  const canDownload = useMemo(() => {
    return (
      profileData.fullName &&
      profileData.phone &&
      profileData.nationalCode.length === 10 &&
      profileData.licenseNumber
    );
  }, [profileData]);

  /* ===============================
      Fetch Verification Status - اصلاح شده
  =============================== */
  const checkVerificationStatus = useCallback(async () => {
    if (!owner?.slug || isCheckingStatus || hasFetchedStatus) return;

    setIsCheckingStatus(true);
    try {
      const res = await fetch(
        `/api/owner/verification-status?slug=${owner.slug}&t=${Date.now()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("خطا در اتصال به سرور");
      }

      const data = await res.json();
      if (data.success) {
        setVerificationStatus(data);
        const newStep = determineStep(data, owner);
        setStep(newStep);
      }

      setHasFetchedStatus(true); // ✅ جلوگیری از fetch مجدد
    } catch (error) {
      console.error("خطا در دریافت وضعیت:", error);
      toast.error("خطا در دریافت وضعیت احراز هویت");
    } finally {
      setIsCheckingStatus(false);
    }
  }, [owner, isCheckingStatus, hasFetchedStatus, determineStep]);

  useEffect(() => {
    // فقط یک بار در mount اولیه فراخوانی شود
    if (!hasFetchedStatus) {
      checkVerificationStatus();
    }
  }, [checkVerificationStatus, hasFetchedStatus]);

  /* ===============================
      Handlers
  =============================== */
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (name, value) => {
    setFiles((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!owner?.slug) return toast.error("کاربر نامعتبر");

    setLoading(true);
    try {
      const res = await fetch("/api/owner/complete-profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: owner.slug,
          ...profileData,
          profileCompleted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در ذخیره اطلاعات");
      }

      toast.success("اطلاعات ذخیره شد");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generate-contract?slug=${owner.slug}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "دانلود ناموفق");
      }

      const blob = await res.blob();

      // چک کن که blob معتبر باشد
      if (blob.size === 0) {
        throw new Error("فایل قرارداد خالی است");
      }

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `تعهدنامه_${owner.name || owner.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      toast.success("قرارداد دانلود شد");
      setStep(3); // برو به مرحله بعد
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitVerification = async () => {
    // اعتبارسنجی فایل‌ها
    const requiredFiles = ["signedContract", "nationalCard", "licenseImage"];
    const missingFiles = requiredFiles.filter((fileName) => !files[fileName]);

    if (missingFiles.length > 0) {
      toast.error(
        `لطفا ${missingFiles
          .map((f) => {
            const names = {
              signedContract: "قرارداد امضا شده",
              nationalCard: "کارت ملی",
              licenseImage: "پروانه کسب",
            };
            return names[f];
          })
          .join("، ")} را آپلود کنید`
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("slug", owner.slug);

      // اضافه کردن فایل‌های الزامی
      formData.append("signedContract", files.signedContract);
      formData.append("nationalCard", files.nationalCard);
      formData.append("licenseImage", files.licenseImage);

      // اضافه کردن فایل‌های اختیاری
      if (files.additionalDocs && files.additionalDocs.length > 0) {
        files.additionalDocs.forEach((f) => {
          if (f) formData.append("additionalDocs", f);
        });
      }

      const res = await fetch("/api/owner/submit-verification", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در ارسال مدارک");
      }

      toast.success("مدارک با موفقیت ارسال شد");

      // ریست کردن وضعیت برای بررسی مجدد
      setHasFetchedStatus(false);
      await checkVerificationStatus();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      Render - اصلاح شده
  =============================== */
  if (!owner) {
    return <div className="p-6 text-center">در حال بارگذاری...</div>;
  }

  // اگر در حال بررسی وضعیت هستیم
  if (isCheckingStatus) {
    return (
      <div className="p-6 border border-blue-300 rounded-lg bg-blue-50 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-blue-600">در حال بررسی وضعیت...</p>
      </div>
    );
  }

  switch (step) {
    case 1:
      return (
        <AuthenticationInfo
          profileData={profileData}
          handleInputChange={handleInputChange}
          saveProfile={saveProfile}
          loading={loading}
          canDownload={canDownload}
        />
      );
    case 2:
      return (
        <ContractDownload
          downloadContract={downloadContract}
          loading={loading}
          setStep={setStep}
        />
      );
    case 3:
      return (
        <SendInfo
          handleFileChange={handleFileChange}
          loading={loading}
          submitVerification={submitVerification}
        />
      );
    case 4:
      return (
        <VerifyAlert
          owner={owner}
          status={verificationStatus}
          onRetry={() => {
            setStep(3);
            setHasFetchedStatus(false); // اجازه بررسی مجدد
          }}
        />
      );
    default:
      return (
        <div className="p-6 text-center text-red-500">
          مرحله نامعتبر. لطفا صفحه را رفرش کنید.
        </div>
      );
  }
}
