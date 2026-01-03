// components/ImageEditorSkeleton.jsx
"use client";

import {
  Download,
  Upload,
  Type,
  Palette,
  X,
  Move,
  Image as ImageIcon,
  Bold,
  Italic,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImageEditorSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* سایدبار سمت راست (تنظیمات) */}
          <div className="lg:col-span-1">
            <Card className="flex h-screen top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="animate-pulse h-5 w-5 rounded bg-gray-300" />
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* آپلود عکس */}
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* انتخاب گرادیانت */}
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>

                {/* مدیریت متن */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>

                  {/* تنظیمات متن فعال */}
                  <div className="space-y-4 p-3 rounded-lg animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-300 rounded" />
                      <div className="h-8 w-8 bg-gray-300 rounded" />
                    </div>

                    <div className="space-y-3">
                      <div className="h-10 w-full bg-gray-200 rounded" />

                      {/* رنگ متن */}
                      <div className="space-y-2">
                        <div className="h-3 w-12 bg-gray-300 rounded" />
                        <div className="h-8 w-full bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* دکمه دانلود */}
                <div className="h-12 w-full bg-gray-300 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>

          {/* بخش پیش‌نمایش */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="animate-pulse h-5 w-5 rounded bg-gray-300" />
                  <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                </CardTitle>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="relative bg-transparent rounded-lg p-4 min-h-[500px] flex items-center justify-center overflow-hidden">
                  {/* حالت خالی */}
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                      <div className="h-12 w-12 bg-gray-400 rounded" />
                    </div>
                    <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mx-auto mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-6" />
                    <div className="h-10 w-32 bg-gray-300 rounded animate-pulse mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
