// components/admin/tours/CreateTourForm/tabs/SettingsTab.jsx
import { MessageSquare, Heart, Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsTab({ formData, handleChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>تنظیمات پیشرفته</CardTitle>
        <CardDescription>تنظیمات نمایش و تعامل با تور</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                فعال‌سازی نظرات
              </Label>
              <p className="text-sm text-gray-500">
                کاربران می‌توانند نظر بدهند
              </p>
            </div>
            <Switch
              checked={formData.enableComments}
              onCheckedChange={(checked) =>
                handleChange("enableComments", checked)
              }
              className="
    transition-colors
    data-[state=unchecked]:bg-gray-600
    data-[state=unchecked]:border
    data-[state=unchecked]:border-gray-300
    data-[state=checked]:bg-gradient-to-r
    data-[state=checked]:from-indigo-500
    data-[state=checked]:to-purple-500
    cursor-pointer
  "
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                نمایش تعداد لایک
              </Label>
              <p className="text-sm text-gray-500">
                تعداد لایک‌ها نمایش داده می‌شود
              </p>
            </div>
            <Switch
              checked={formData.showLikes}
              onCheckedChange={(checked) => handleChange("showLikes", checked)}
              className="
    transition-colors
    data-[state=unchecked]:bg-gray-600
    data-[state=unchecked]:border
    data-[state=unchecked]:border-gray-300
    data-[state=checked]:bg-gradient-to-r
    data-[state=checked]:from-indigo-500
    data-[state=checked]:to-purple-500
    cursor-pointer
  "
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                نمایش امتیاز
              </Label>
              <p className="text-sm text-gray-500">
                امتیاز تور نمایش داده می‌شود
              </p>
            </div>
            <Switch
              checked={formData.showRating}
              onCheckedChange={(checked) => handleChange("showRating", checked)}
              className="
    transition-colors
    data-[state=unchecked]:bg-gray-600
    data-[state=unchecked]:border
    data-[state=unchecked]:border-gray-300
    data-[state=checked]:bg-gradient-to-r
    data-[state=checked]:from-indigo-500
    data-[state=checked]:to-purple-500
    cursor-pointer
  "
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
