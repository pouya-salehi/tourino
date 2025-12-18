"use client";

import { useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaUploader({ onUpload }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files.length) return;
    onUpload(files);
    inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
    >
      <ImageIcon className="h-14 w-14 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-700 font-medium">
        کلیک کنید یا فایل‌ها را رها کنید
      </p>

      <Button variant="outline" className="mt-4" type="button">
        انتخاب عکس‌ها
      </Button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files))}
      />
    </div>
  );
}
