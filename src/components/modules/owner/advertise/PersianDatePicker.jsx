"use client";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function PersianDatePicker({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="font-bold text-gray-500">تاریخ انقضا</label>
      <div className="border rounded-md shadow-xs w-full">
        <DatePicker
        value={value}
        onChange={(date) => onChange(date?.toDate())}
        calendar={persian}
        locale={persian_fa}
        minDate={new Date()}
        inputClass="inputs p-1.5 rounded-md text-gray-500 font-bold w-lg"
        style={{
          width: "100%",
        }}
      />
      </div>
    </div>
  );
}
