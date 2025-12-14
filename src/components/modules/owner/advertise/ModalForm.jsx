import PersianDatePicker from "./PersianDatePicker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModalForm({ form, setForm, bgColors }) {
  return (
    <div className="grid grid-cols-2 w-full py-4 gap-4">
      {/* عنوان */}
      <div className="flex flex-col">
        <label className="font-bold text-gray-500">عنوان</label>
        <Input
          type="text"
          className="inputs p-2 rounded-md text-gray-500 font-bold"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* درصد */}
      <div className="flex flex-col">
        <label className="font-bold text-gray-500">درصد تخفیف</label>
        <Input
          type="number"
          className="inputs p-2 rounded-md text-gray-500 font-bold"
          value={form.couponPercentage}
          onChange={(e) =>
            setForm({ ...form, couponPercentage: Number(e.target.value) })
          }
        />
      </div>

      {/* تقویم */}
      <PersianDatePicker
        value={form.expiresAt}
        onChange={(d) => setForm({ ...form, expiresAt: d })}
      />

      {/* نوع پس زمینه */}
      <div className="flex flex-col">
        <label className="font-bold text-gray-500">نوع پس‌زمینه</label>
        <Select
          value={form.backgroundType}
          onValueChange={(value) => setForm({ ...form, backgroundType: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="یک رنگ رو انتخاب کن" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>رنگ ها</SelectLabel>
              <SelectItem value="solid">رنگ ساده</SelectItem>
              <SelectItem value="gradient">گرادینت</SelectItem>
              <SelectItem value="image">تصویر</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* انیمیشن */}
      <div className="flex flex-col">
        <label className="font-bold text-gray-500">انیمیشن</label>
        <Select
          value={form.animation}
          onValueChange={(value) => setForm({ ...form, animation: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="یک نوع انیمشن رو انتخاب کن" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>انیمشن ها</SelectLabel>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide-up">Slide Up</SelectItem>
              <SelectItem value="slide-down">Slide Down</SelectItem>
              <SelectItem value="zoom-in">Zoom In</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* رنگ / گرادینت */}
      <div className="flex flex-col">
        <label className="font-bold text-gray-500">انتخاب پس‌زمینه</label>
        <Select
          value={form.backgroundValue}
          onValueChange={(value) =>
            setForm({ ...form, backgroundValue: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="یک رنگ انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>رنگ‌ها</SelectLabel>
              {bgColors.map((bg, i) => (
                <SelectItem key={i} value={bg.value}>
                  {bg.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* رنگ ساده */}
      {form.backgroundType === "solid" && (
        <div className="flex flex-col">
          <label className="font-bold text-gray-500 mb-2">رنگ سفارشی</label>
          <Input
            type="color"
            className="h-10 p-2 w-full cursor-pointer"
            value={form.backgroundValue || "#000000"}
            onChange={(e) =>
              setForm({ ...form, backgroundValue: e.target.value })
            }
          />
        </div>
      )}

      {/* تصویر */}
      {form.backgroundType === "image" && (
        <div className="flex flex-col">
          <label className="font-bold text-gray-500">آدرس تصویر</label>
          <Input
            type="text"
            placeholder="آدرس تصویر (URL)"
            className="inputs p-2 rounded-md text-gray-500 font-bold"
            value={form.backgroundValue || ""}
            onChange={(e) =>
              setForm({ ...form, backgroundValue: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
