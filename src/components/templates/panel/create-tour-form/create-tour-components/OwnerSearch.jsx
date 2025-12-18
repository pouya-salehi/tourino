"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  User,
  Check,
  Loader2,
  Users,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/toast";
import Image from "next/image";

export default function OwnerSearch({
  value = [],
  onChange,
  maxSelect = 1, // ✅ پیش‌فرض 1 (تک انتخابی)
  placeholder = "جستجوی برگزارکننده...",
  disabled = false,
  required = true,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const searchTimeout = useRef(null);
  const containerRef = useRef(null);

  // مقدار اولیه
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      // تبدیل slugها به objectهای مالک
      const initialOwners = value.map((slug) => ({
        id: Date.now() + Math.random(),
        name: `مالک ${slug}`,
        slug,
        email: `${slug}@example.com`,
        avatar: null,
        role: "OWNER",
      }));
      setSelectedOwners(initialOwners);
    } else {
      setSelectedOwners([]);
    }
  }, [value]);

  // جستجوی مالکان با debounce
  const searchOwners = useCallback(
    async (query) => {
      if (disabled) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: query,
          limit: "10",
        });

        console.log("🔍 Fetching owners with query:", query);

        const res = await fetch(`/api/tours/search?${params}`);

        if (!res.ok) {
          throw new Error(`خطای سرور: ${res.status}`);
        }

        const result = await res.json();

        console.log("✅ API Response:", {
          success: result.success,
          count: result.owners?.length || 0,
          message: result.message,
        });

        if (result.success && Array.isArray(result.owners)) {
          // ✅ اطمینان از ساختار داده
          const safeOwners = result.owners.map((owner) => ({
            id: owner.id || Date.now() + Math.random(),
            name: owner.name || "بدون نام",
            slug: owner.slug || "unknown",
            email: owner.email || "no-email@example.com",
            avatar: owner.avatar || null,
            role: owner.role || "OWNER",
          }));

          setOwners(safeOwners);

          if (safeOwners.length === 0 && query.trim()) {
            setError("نتیجه‌ای یافت نشد");
          }
        } else {
          throw new Error(result.message || "خطا در دریافت داده‌ها");
        }
      } catch (error) {
        console.error("❌ Search error:", error);
        setError("خطا در اتصال به سرور");
        setOwners([]);
        toast.error("خطا در دریافت داده‌ها");
      } finally {
        setLoading(false);
      }
    },
    [disabled]
  );

  // Debounce جستجو
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (open) {
        searchOwners(searchQuery);
      }
    }, 350);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, open, searchOwners]);

  // اول بار لود کردن
  useEffect(() => {
    if (open && owners.length === 0) {
      searchOwners("");
    }
  }, [open, owners.length, searchOwners]);

  // مدیریت انتخاب مالک
  const handleSelectOwner = (owner) => {
    const isSelected = selectedOwners.some((o) => o.slug === owner.slug);

    let newSelected;
    if (isSelected) {
      // حذف مالک
      newSelected = selectedOwners.filter((o) => o.slug !== owner.slug);
    } else {
      // اضافه کردن مالک
      if (selectedOwners.length >= maxSelect) {
        toast.warning(`حداکثر ${maxSelect} برگزارکننده می‌توانید انتخاب کنید`);
        return;
      }
      newSelected = maxSelect === 1 ? [owner] : [...selectedOwners, owner];
    }

    setSelectedOwners(newSelected);
    onChange(newSelected.map((o) => o.slug));

    if (maxSelect === 1) {
      setSearchQuery(""); // ریست جستجو برای تک انتخابی
      setOpen(false); // بستن پاپ‌اور
    }
  };

  // حذف مالک انتخاب شده
  const handleRemoveOwner = (slug) => {
    const newSelected = selectedOwners.filter((o) => o.slug !== slug);
    setSelectedOwners(newSelected);
    onChange(newSelected.map((o) => o.slug));
  };

  // خالی کردن همه
  const handleClearAll = () => {
    setSelectedOwners([]);
    onChange([]);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <Label className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        برگزارکننده‌ها {required && "*"}
        {selectedOwners.length > 0 && (
          <span className="text-xs text-gray-500">
            ({selectedOwners.length}/{maxSelect} انتخاب شده)
          </span>
        )}
      </Label>

      {/* نمایش مالک‌های انتخاب شده */}
      {selectedOwners.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
          {selectedOwners.map((owner) => (
            <Badge
              key={owner.slug}
              variant="secondary"
              className="px-3 py-1.5 text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span className="font-medium">{owner.name}</span>
                <span className="text-gray-500">@{owner.slug}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOwner(owner.slug)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="حذف"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </Badge>
          ))}
          {selectedOwners.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              حذف همه
            </Button>
          )}
        </div>
      )}

      {/* کامپوننت جستجو */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => !disabled && setOpen(true)}
                disabled={disabled}
                className="w-full pr-10 cursor-pointer"
                readOnly={maxSelect === 1 && selectedOwners.length > 0} // فقط خواندنی اگر انتخاب شده
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-full md:w-[400px] p-0"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command shouldFilter={false} className="rounded-lg border">
            <div className="px-3 pt-3">
              <CommandInput
                placeholder="جستجوی نام، آدرس یا ایمیل..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                autoFocus
              />
            </div>
            <CommandList>
              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">در حال جستجو...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-gray-600">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => searchOwners(searchQuery)}
                    className="mt-3"
                  >
                    تلاش مجدد
                  </Button>
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="py-8 text-center">
                      <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">مالکی یافت نشد</p>
                      <p className="text-sm text-gray-500 mt-1">
                        نام یا آدرس کاربری را وارد کنید
                      </p>
                    </div>
                  </CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {owners.map((owner) => {
                      const isSelected = selectedOwners.some(
                        (o) => o.slug === owner.slug
                      );
                      return (
                        <CommandItem
                          key={owner.id || owner.slug}
                          value={owner.slug}
                          onSelect={() => handleSelectOwner(owner)}
                          className="cursor-pointer aria-selected:bg-blue-50"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-9 w-9 rounded-full flex items-center justify-center border",
                                  isSelected
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-gray-100 border-gray-300"
                                )}
                              >
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium flex items-center gap-1">
                                  {owner.name}
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-green-500" />
                                  )}
                                </span>
                                <span className="text-sm text-gray-500">
                                  @{owner.slug}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-[120px]">
                              {owner.email}
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>

            {/* نکات پایین */}
            <div className="border-t p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• برای انتخاب کلیک کنید</p>
                  <p>• حداکثر {maxSelect} برگزارکننده</p>
                  {maxSelect === 1 && (
                    <p className="text-amber-600">
                      ⚠️ فقط یک مالک قابل انتخاب است
                    </p>
                  )}
                </div>
                {selectedOwners.length > 0 && (
                  <Badge variant="outline" className="bg-white">
                    {selectedOwners.length} انتخاب شده
                  </Badge>
                )}
              </div>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {/* راهنما */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 مالک تور را جستجو و انتخاب کنید</p>
        {maxSelect > 1 && (
          <p>🔍 می‌توانید تا {maxSelect} برگزارکننده انتخاب کنید</p>
        )}
        {selectedOwners.length === 0 && required && (
          <p className="text-amber-600">⚠️ حداقل یک برگزارکننده انتخاب کنید</p>
        )}
      </div>
    </div>
  );
}
