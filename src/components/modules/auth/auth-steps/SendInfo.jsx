"use client";
//module
import FileUploader from "@/components/templates/panel/file-uploder/FileUploader";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//icons
import { FileText } from "lucide-react";
function SendInfo({ handleFileChange, loading, submitVerification }) {
  return (
    <Card className="w-full max-w-2xl bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ارسال مدارک احراز هویت
        </CardTitle>
        <CardDescription>لطفاً مدارک زیر را آپلود کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploader
          name="signedContract"
          label="قرارداد امضا شده *"
          accept=".jpg,.jpeg,.png,.pdf"
          required
          onFilesChange={(file) => handleFileChange("signedContract", file)}
        />

        <FileUploader
          name="nationalCard"
          label="تصویر کارت ملی *"
          accept=".jpg,.jpeg,.png"
          required
          onFilesChange={(file) => handleFileChange("nationalCard", file)}
        />

        <FileUploader
          name="licenseImage"
          label="تصویر پروانه کسب *"
          accept=".jpg,.jpeg,.png"
          required
          onFilesChange={(file) => handleFileChange("licenseImage", file)}
        />

        <FileUploader
          name="additionalDocs"
          label="مدارک اضافی (اختیاری)"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
          maxFiles={3}
          onFilesChange={(files) => handleFileChange("additionalDocs", files)}
        />

        <Button
          onClick={submitVerification}
          disabled={loading}
          className="w-full"
        >
          {loading ? "در حال ارسال..." : "ارسال مدارک"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default SendInfo;
