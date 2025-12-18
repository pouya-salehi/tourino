// components/admin/tours/CreateTourForm/tabs/ScheduleTab.jsx
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ScheduleTab({
  formData,
  handleChange,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>برنامه روزانه سفر</CardTitle>
        <CardDescription>برنامه دقیق هر روز سفر را مشخص کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.schedule.map((day, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">روز {day.day}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArrayItem("schedule", index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Input
                value={day.title}
                onChange={(e) => {
                  const newSchedule = [...formData.schedule];
                  newSchedule[index].title = e.target.value;
                  handleChange("schedule", newSchedule);
                }}
                placeholder="عنوان روز (مثال: حرکت به سمت کاشان)"
              />
              <Textarea
                value={day.description}
                onChange={(e) => {
                  const newSchedule = [...formData.schedule];
                  newSchedule[index].description = e.target.value;
                  handleChange("schedule", newSchedule);
                }}
                placeholder="شرح کامل برنامه روز"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addArrayItem("schedule", {
              day: formData.schedule.length + 1,
              title: "",
              description: "",
            })
          }
          className="w-full"
        >
          <Plus className="h-4 w-4 ml-2" />
          افزودن روز جدید
        </Button>
      </CardContent>
    </Card>
  );
}
