"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Building2, User2 } from "lucide-react";

export default function SelectRole({ value, onChange }) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="نوع حساب را انتخاب کنید" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="USER">
            <div className="flex items-center gap-2">
              <User2 className="w-4 h-4" />
              کاربر (مسافر)
            </div>
          </SelectItem>

          <SelectItem value="OWNER">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              صاحب تور / آژانس
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
