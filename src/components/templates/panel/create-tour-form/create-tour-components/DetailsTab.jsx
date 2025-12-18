// components/admin/tours/CreateTourForm/tabs/DetailsTab.jsx
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DetailsTab({
  formData,
  handleChange,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>جزئیات و امکانات تور</CardTitle>
        <CardDescription>
          امکانات، خدمات شامل و غیر شامل را مشخص کنید
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>امکانات تور</Label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index] = e.target.value;
                  handleChange("features", newFeatures);
                }}
                placeholder="مثال: بیمه مسافرتی، راهنمای تور"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem("features", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("features", "")}
            className="mt-3"
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن امکان
          </Button>
        </div>

        <Separator />

        <div>
          <Label className="text-green-700">شامل (خدمات ارائه شده)</Label>
          {formData.includes.map((include, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={include}
                onChange={(e) => {
                  const newIncludes = [...formData.includes];
                  newIncludes[index] = e.target.value;
                  handleChange("includes", newIncludes);
                }}
                placeholder="مثال: اقامت در هتل ۴ ستاره"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem("includes", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("includes", "")}
            className="mt-3"
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن خدمت
          </Button>
        </div>

        <Separator />

        <div>
          <Label className="text-red-700">غیر شامل (خدمات ارائه نشده)</Label>
          {formData.excludes.map((exclude, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={exclude}
                onChange={(e) => {
                  const newExcludes = [...formData.excludes];
                  newExcludes[index] = e.target.value;
                  handleChange("excludes", newExcludes);
                }}
                placeholder="مثال: هزینه‌های شخصی"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem("excludes", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("excludes", "")}
            className="mt-3"
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن مورد
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
