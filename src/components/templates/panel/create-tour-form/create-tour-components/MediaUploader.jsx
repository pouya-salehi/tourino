"use client";

import { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaUploader({ onUpload, disabled = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files.length || disabled) return;
    onUpload(files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
        transition-all duration-300
        ${dragging 
          ? "border-primary bg-primary/5" 
          : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="space-y-3">
        {disabled ? (
          <Loader2 className="h-14 w-14 mx-auto text-gray-400 mb-4 animate-spin" />
        ) : (
          <ImageIcon className="h-14 w-14 mx-auto text-gray-400 mb-4" />
        )}
        
        <p className="text-gray-700 font-medium">
          {dragging ? "رها کنید" : "کلیک کنید یا فایل‌ها را رها کنید"}
        </p>
        <p className="text-sm text-gray-500">
          فرمت‌های مجاز: JPG, PNG, WebP, GIF
        </p>

        <Button 
          variant="outline" 
          className="mt-4" 
          type="button"
          disabled={disabled}
        >
          {disabled ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              در حال آپلود...
            </>
          ) : (
            "انتخاب عکس‌ها"
          )}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        disabled={disabled}
      />
    </div>
  );
}