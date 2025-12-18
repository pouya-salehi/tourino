"use client";

import { MapPin, DollarSign, Users, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

export default function BasicInfoTab({
  formData,
  handleChange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  owners,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          اطلاعات اصلی تور
        </CardTitle>
        <CardDescription>اطلاعات پایه تور را وارد کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="title">عنوان تور *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: تور کویر مرنجاب"
              required
            />
            <p className="text-xs text-gray-500">
              عنوان جذاب و کلمات کلیدی را استفاده کنید
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="ownerSlug">برگزار کننده *</Label>
            <Select
              value={formData.ownerSlug}
              onValueChange={(value) => handleChange("ownerSlug", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب برگزارکننده" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.slug} value={owner.slug}>
                    {owner.name} (@{owner.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="location">
              <MapPin className="inline h-4 w-4 mr-1" />
              مکان برگزاری *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="مثال: کویر مرنجاب، کاشان"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="price">
                <DollarSign className="inline h-4 w-4 mr-1" />
                قیمت (تومان) *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="مثال: 1500000"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxPeople">
                <Users className="inline h-4 w-4 mr-1" />
                حداکثر نفرات
              </Label>
              <Input
                id="maxPeople"
                type="number"
                value={formData.maxPeople}
                onChange={(e) => handleChange("maxPeople", e.target.value)}
                placeholder="مثال: 20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description">توضیحات تور *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="تور خود را با جزئیات کامل شرح دهید..."
            rows={8}
            required
          />
          <p className="text-xs text-gray-500">
            حداقل ۳۰۰ کاراکتر برای سئو بهتر
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>تاریخ شروع</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right font-normal"
                >
                  <Calendar className="ml-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={faIR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label>تاریخ پایان</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right font-normal"
                >
                  <Calendar className="ml-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={faIR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
