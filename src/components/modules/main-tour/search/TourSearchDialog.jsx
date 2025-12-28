"use client";

import { useEffect, useState } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function TourSearchCombobox({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // 🔍 live search
  useEffect(() => {
    if (!value || value.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/tours?search=${encodeURIComponent(value)}&limit=5`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (data.success) {
          setResults(data.data || []);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value ? value : "جستجوی تور یا برگزارکننده..."}
          <Search className="mr-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="جستجو..."
            value={value}
            onValueChange={onChange}
            autoFocus
          />

          <CommandList className="w-md">
            {loading && (
              <div className="p-3 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && value && (
              <CommandEmpty>نتیجه‌ای یافت نشد</CommandEmpty>
            )}

            {results.length > 0 && (
              <>
                <CommandGroup heading="تورهای پیشنهادی">
                  {results.map((tour) => (
                    <CommandItem
                      key={tour.id}
                      value={tour.title}
                      onSelect={(val) => {
                        onChange(val);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      <span>{tour.title}</span>
                      {value === tour.title && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandItem
                  onSelect={() => setOpen(false)}
                  className="justify-center text-primary font-medium"
                >
                  دیدن همه نتایج برای «{value}»
                </CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
