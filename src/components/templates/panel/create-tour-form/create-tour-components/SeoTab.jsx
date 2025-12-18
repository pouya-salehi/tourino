// components/admin/tours/CreateTourForm/tabs/SeoTab.jsx
import { Globe, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SeoTab({ formData, handleChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          بهینه‌سازی موتور جستجو (SEO)
        </CardTitle>
        <CardDescription>تنظیمات SEO برای رتبه بهتر در گوگل</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>آدرس SEO (Slug)</Label>
          <Input
            value={formData.seoSlug}
            onChange={(e) => handleChange("seoSlug", e.target.value)}
            placeholder="tour-kavir-meranjab"
          />
          <p className="text-xs text-gray-500">
            فقط حروف انگلیسی، اعداد و خط تیره
          </p>
        </div>

        <div className="space-y-3">
          <Label>عنوان متا (Meta Title)</Label>
          <Input
            value={formData.metaTitle}
            onChange={(e) => handleChange("metaTitle", e.target.value)}
            placeholder="تور کویر مرنجاب - تجربه‌ای فراموش‌نشدنی"
          />
          <p className="text-xs text-gray-500">حداکثر ۶۰ کاراکتر</p>
        </div>

        <div className="space-y-3">
          <Label>توضیحات متا (Meta Description)</Label>
          <Textarea
            value={formData.metaDescription}
            onChange={(e) => handleChange("metaDescription", e.target.value)}
            placeholder="تور کویر مرنجاب با خدمات کامل شامل اقامت، غذا و..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            حداکثر ۱۶۰ کاراکتر - مهم برای CTR گوگل
          </p>
        </div>

        <div className="space-y-3">
          <Label>کلمات کلیدی (Keywords)</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.metaKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
                <button
                  type="button"
                  onClick={() => {
                    const newKeywords = [...formData.metaKeywords];
                    newKeywords.splice(index, 1);
                    handleChange("metaKeywords", newKeywords);
                  }}
                  className="mr-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="کلمه کلیدی جدید"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target;
                  if (input.value.trim()) {
                    handleChange("metaKeywords", [
                      ...formData.metaKeywords,
                      input.value.trim(),
                    ]);
                    input.value = "";
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  handleChange("metaKeywords", [
                    ...formData.metaKeywords,
                    input.value.trim(),
                  ]);
                  input.value = "";
                }
              }}
            >
              افزودن
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            کلمات کلیدی مرتبط با تور را وارد کنید
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">
            💡 نکات SEO برای تور کویر:
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• "تور کویر مرنجاب کاشان" - کلمه کلیدی اصلی</li>
            <li>• "سفر به کویر" - کلمه کلیدی ثانویه</li>
            <li>• "تور طبیعت گردی" - کلمه کلیدی گسترده</li>
            <li>• "تور آخر هفته" - کلمه کلیدی موقعیتی</li>
            <li>• از کلمات "بهترین"، "ارزان"، "ویژه" استفاده کنید</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
