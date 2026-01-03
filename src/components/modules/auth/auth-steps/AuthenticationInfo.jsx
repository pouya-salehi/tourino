"use client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
function AuthenticationInfo({
  profileData,
  handleInputChange,
  saveProfile,
  loading,
  canDownload,
}) {
  return (
    <Card className="w-full max-w-2xl bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeAlert className="h-5 w-5" />
          تکمیل اطلاعات هویتی
        </CardTitle>
        <CardDescription>لطفاً اطلاعات هویتی خود را تکمیل کنید</CardDescription>
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

export default AuthenticationInfo;
