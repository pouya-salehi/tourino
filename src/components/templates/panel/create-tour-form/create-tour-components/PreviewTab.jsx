// components/admin/tours/CreateTourForm/tabs/PreviewTab.jsx
import { MapPin, DollarSign, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PreviewTab({ formData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>پیش‌نمایش تور</CardTitle>
        <CardDescription>
          تور شما به این شکل در سایت نمایش داده می‌شود
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-6 bg-white">
          {formData.title ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {formData.title}
              </h2>

              <div className="flex flex-wrap gap-4 mb-6">
                {formData.location && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.price && (
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {parseInt(formData.price).toLocaleString()} تومان
                    </span>
                  </div>
                )}
                {formData.maxPeople && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Users className="h-4 w-4" />
                    <span>تا {formData.maxPeople} نفر</span>
                  </div>
                )}
              </div>

              {formData.description && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">
                    {formData.description.substring(0, 300)}...
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">اطلاعات SEO:</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>آدرس:</strong> tourino.ir/tours/{formData.seoSlug}
                  </p>
                  <p>
                    <strong>عنوان صفحه:</strong>{" "}
                    {formData.metaTitle || formData.title}
                  </p>
                  <p>
                    <strong>توضیحات:</strong>{" "}
                    {formData.metaDescription?.substring(0, 100)}...
                  </p>
                  {formData.metaKeywords.length > 0 && (
                    <p>
                      <strong>کلمات کلیدی:</strong>{" "}
                      {formData.metaKeywords.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              اطلاعات تور را وارد کنید تا پیش‌نمایش را ببینید
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
