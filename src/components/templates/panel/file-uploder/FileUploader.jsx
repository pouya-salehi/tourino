// components/templates/panel/file-uploder/FileUploader.jsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function FileUploader({
  name,
  label,
  accept = ".jpg,.jpeg,.png,.pdf",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onFilesChange,
  required = false,
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // چک کردن نوع فایل
    const allowedTypes = accept.split(",");
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (
      !allowedTypes.some(
        (type) => type.trim() === fileExtension || type.trim() === file.type
      )
    ) {
      toast.error(`فرمت ${fileExtension} مجاز نیست`);
      return false;
    }

    // چک کردن حجم فایل
    if (file.size > maxSize) {
      toast.error(
        `حجم فایل ${file.name} بیش از ${maxSize / (1024 * 1024)}MB است`
      );
      return false;
    }

    // چک کردن تعداد فایل‌ها
    if (multiple && files.length >= maxFiles) {
      toast.error(`حداکثر ${maxFiles} فایل مجاز است`);
      return false;
    }

    return true;
  };

  // اصلاح بخش handleFileChange در FileUploader.jsx
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    // اعتبارسنجی هر فایل
    const validFiles = selectedFiles.filter(validateFile);

    if (validFiles.length === 0) return;

    let newFilesList;

    // اگر multiple نباشد، فقط یک فایل نگه دار
    if (!multiple) {
      newFilesList = validFiles.slice(0, 1);
      setFiles(newFilesList);
      onFilesChange?.(newFilesList[0]); // ✅ فقط فایل اول
    } else {
      newFilesList = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(newFilesList);
      onFilesChange?.(newFilesList); // ✅ کل آرایه
    }

    // ریست کردن input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(0);

      const fd = new FormData();
      fd.append("file", file);

      // شبیه‌سازی progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("/api/owner/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در آپلود");
      }

      const data = await res.json();
      return data.fileKey;
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(multiple ? newFiles : null);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-4 h-4" />;
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {multiple && (
          <span className="text-xs text-gray-500">
            {files.length} / {maxFiles}
          </span>
        )}
      </div>

      {/* Area آپلود */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange} // ⚡ اینجا تغییر دادم!
          className="hidden"
        />

        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 mb-1">
          کلیک کنید یا فایل را اینجا رها کنید
        </p>
        <p className="text-xs text-gray-500">
          {accept} (حداکثر {maxSize / (1024 * 1024)}MB)
        </p>
      </div>

      {/* Progress بارگذاری */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-gray-500">
            در حال آپلود... {progress}%
          </p>
        </div>
      )}

      {/* لیست فایل‌های انتخاب شده */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">فایل‌های انتخاب شده:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* راهنما */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>فایل‌های با کیفیت و خوانا ارسال کنید</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>فرمت‌های مجاز: {accept}</span>
        </div>
      </div>
    </div>
  );
}
