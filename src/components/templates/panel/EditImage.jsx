// components/ImageEditor.jsx
"use client";

import { useState, useRef, useEffect } from "react";
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
  AlignRight,
  AlignCenter,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImageEditor() {
  const [image, setImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [activeText, setActiveText] = useState(null);
  const [overlay, setOverlay] = useState("dark-bottom");
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // گرادیانت‌های حرفه‌ای از پایین
  const gradients = [
    {
      id: "dark-bottom",
      name: "تاریک پایین",
      stops: [
        { offset: 0, color: "rgba(0,0,0,0)", position: 0 },
        { offset: 0.4, color: "rgba(0,0,0,0.3)", position: 0.4 },
        { offset: 1, color: "rgba(0,0,0,0.7)", position: 1 },
      ],
    },
    {
      id: "blue-bottom",
      name: "آبی پایین",
      stops: [
        { offset: 0, color: "rgba(0,100,255,0)", position: 0 },
        { offset: 0.4, color: "rgba(0,100,255,0.3)", position: 0.4 },
        { offset: 1, color: "rgba(0,100,255,0.7)", position: 1 },
      ],
    },
    {
      id: "purple-bottom",
      name: "بنفش پایین",
      stops: [
        { offset: 0, color: "rgba(147,51,234,0)", position: 0 },
        { offset: 0.4, color: "rgba(147,51,234,0.3)", position: 0.4 },
        { offset: 1, color: "rgba(147,51,234,0.7)", position: 1 },
      ],
    },
    {
      id: "gradient-royal",
      name: "شاهانه",
      stops: [
        { offset: 0, color: "rgba(0,0,0,0)", position: 0 },
        { offset: 0.3, color: "rgba(0,0,0,0.2)", position: 0.3 },
        { offset: 1, color: "rgba(0,0,0,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-sunset",
      name: "غروب",
      stops: [
        { offset: 0, color: "rgba(255,140,0,0)", position: 0 },
        { offset: 0.4, color: "rgba(255,140,0,0.2)", position: 0.4 },
        { offset: 1, color: "rgba(220,20,60,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-ocean",
      name: "اقیانوس",
      stops: [
        { offset: 0, color: "rgba(0,180,216,0)", position: 0 },
        { offset: 0.4, color: "rgba(0,180,216,0.3)", position: 0.4 },
        { offset: 1, color: "rgba(3,4,94,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-forest",
      name: "جنگل",
      stops: [
        { offset: 0, color: "rgba(0,100,0,0)", position: 0 },
        { offset: 0.4, color: "rgba(0,100,0,0.3)", position: 0.4 },
        { offset: 1, color: "rgba(0,50,0,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-gold",
      name: "طلایی",
      stops: [
        { offset: 0, color: "rgba(212,175,55,0)", position: 0 },
        { offset: 0.4, color: "rgba(212,175,55,0.2)", position: 0.4 },
        { offset: 1, color: "rgba(184,134,11,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-rose",
      name: "رُز",
      stops: [
        { offset: 0, color: "rgba(255,228,225,0)", position: 0 },
        { offset: 0.4, color: "rgba(255,182,193,0.2)", position: 0.4 },
        { offset: 1, color: "rgba(219,112,147,0.6)", position: 1 },
      ],
    },
    {
      id: "gradient-smoke",
      name: "دودی",
      stops: [
        { offset: 0, color: "rgba(245,245,245,0)", position: 0 },
        { offset: 0.4, color: "rgba(169,169,169,0.2)", position: 0.4 },
        { offset: 1, color: "rgba(105,105,105,0.6)", position: 1 },
      ],
    },
  ];

  // هندلر آپلود عکس
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        drawCanvas(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // اضافه کردن متن جدید
  const addText = () => {
    const newText = {
      id: Date.now(),
      content: "متن خود را ویرایش کنید",
      x: 100,
      y: 100,
      fontSize: 32,
      color: "#ffffff",
      fontFamily: "Vazirmatn, sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "right",
      shadow: true,
      opacity: 1,
    };
    setTexts([...texts, newText]);
    setActiveText(newText.id);
  };

  // حذف متن
  const removeText = (id) => {
    setTexts(texts.filter((text) => text.id !== id));
    if (activeText === id) setActiveText(null);
  };

  // شروع درگ
  const startDrag = (e, textId) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveText(textId);

    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // درگ کردن
  const handleDrag = (e) => {
    if (!isDragging || !activeText) return;

    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTexts(
        texts.map((text) =>
          text.id === activeText ? { ...text, x: x, y: y } : text
        )
      );
    }
  };

  // پایان درگ
  const endDrag = () => {
    setIsDragging(false);
  };

  // کشیدن روی canvas
  const drawCanvas = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");

    // تنظیم سایز canvas
    canvas.width = img.width;
    canvas.height = img.height;

    // پاک کردن canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // کشیدن عکس اصلی
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // کشیدن گرادیانت از پایین
    const selectedGradient = gradients.find((g) => g.id === overlay);
    if (selectedGradient) {
      const grd = ctx.createLinearGradient(0, canvas.height, 0, 0);

      selectedGradient.stops.forEach((stop) => {
        grd.addColorStop(stop.position, stop.color);
      });

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // کشیدن متن‌ها
    texts.forEach((text) => {
      ctx.save();

      // تنظیم استایل متن
      ctx.font = `${text.fontStyle === "italic" ? "italic " : ""}${
        text.fontWeight === "bold" ? "bold " : ""
      }${text.fontSize}px ${text.fontFamily}`;
      ctx.fillStyle = text.color;
      ctx.textAlign = text.textAlign;
      ctx.globalAlpha = text.opacity;

      // اضافه کردن سایه
      if (text.shadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      ctx.fillText(text.content, text.x, text.y);
      ctx.restore();
    });
  };

  // دانلود عکس
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "عکس-ویرایش-شده.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  // رندر مجدد وقتی چیزی تغییر کرد
  useEffect(() => {
    if (image) {
      drawCanvas(image);
    }
  }, [image, texts, overlay, scale]);

  // Event listeners برای درگ
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", endDrag);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", endDrag);
      };
    }
  }, [isDragging, activeText]);

  // متن فعال
  const activeTextData = texts.find((t) => t.id === activeText);

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="flex h-screen top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  تنظیمات ویرایش
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* آپلود عکس */}
                <div className="space-y-3">
                  <Label>آپلود عکس</Label>
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    انتخاب فایل عکس
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {image && (
                    <p className="text-xs text-green-600">
                      ✓ عکس با موفقیت آپلود شد
                    </p>
                  )}
                </div>

                {/* انتخاب گرادیانت */}
                <div className="space-y-3">
                  <Label>گرادیانت overlay</Label>
                  <Select value={overlay} onValueChange={setOverlay}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="انتخاب گرادیانت" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradients.map((grad) => (
                        <SelectItem key={grad.id} value={grad.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{
                                background: `linear-gradient(to top, ${grad.stops[0].color}, ${grad.stops[2].color})`,
                              }}
                            />
                            {grad.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* مدیریت متن */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      مدیریت متن‌ها
                    </Label>
                    <Button onClick={addText} size="sm" variant="outline">
                      + متن جدید
                    </Button>
                  </div>
                  {/* تنظیمات متن فعال */}
                  {activeTextData && (
                    <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">ویرایش متن</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeText(activeTextData.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          value={activeTextData.content}
                          onChange={(e) => {
                            setTexts(
                              texts.map((t) =>
                                t.id === activeTextData.id
                                  ? { ...t, content: e.target.value }
                                  : t
                              )
                            );
                          }}
                          placeholder="متن خود را وارد کنید"
                        />

                        {/* اضافه کردن انتخاب رنگ متن */}
                        <div className="space-y-2">
                          <Label className="text-xs">رنگ متن</Label>
                          <Select
                            value={activeTextData.color}
                            onValueChange={(value) => {
                              setTexts(
                                texts.map((t) =>
                                  t.id === activeTextData.id
                                    ? { ...t, color: value }
                                    : t
                                )
                              );
                            }}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="انتخاب رنگ" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* رنگ‌های ساده */}
                              <SelectItem value="#ffffff">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
                                  سفید
                                </div>
                              </SelectItem>
                              <SelectItem value="#000000">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-black" />
                                  سیاه
                                </div>
                              </SelectItem>
                              <SelectItem value="#f8fafc">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300" />
                                  خاکستری روشن
                                </div>
                              </SelectItem>
                              <SelectItem value="#334155">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-gray-600" />
                                  خاکستری تیره
                                </div>
                              </SelectItem>

                              {/* رنگ‌های اصلی */}
                              <SelectItem value="#dc2626">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-red-600" />
                                  قرمز
                                </div>
                              </SelectItem>
                              <SelectItem value="#2563eb">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                                  آبی
                                </div>
                              </SelectItem>
                              <SelectItem value="#16a34a">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-green-600" />
                                  سبز
                                </div>
                              </SelectItem>
                              <SelectItem value="#ca8a04">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-yellow-600" />
                                  زرد
                                </div>
                              </SelectItem>
                              <SelectItem value="#7c3aed">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-purple-600" />
                                  بنفش
                                </div>
                              </SelectItem>
                              <SelectItem value="#f97316">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                                  نارنجی
                                </div>
                              </SelectItem>
                              <SelectItem value="#ec4899">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                                  صورتی
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">اندازه</Label>
                            <Slider
                              value={[activeTextData.fontSize]}
                              onValueChange={([value]) => {
                                setTexts(
                                  texts.map((t) =>
                                    t.id === activeTextData.id
                                      ? { ...t, fontSize: value }
                                      : t
                                  )
                                );
                              }}
                              min={12}
                              max={72}
                              step={1}
                              className="mt-2"
                            />
                            <p className="text-xs text-gray-500 text-center mt-1">
                              {activeTextData.fontSize}px
                            </p>
                          </div>

                          <div>
                            <Label className="text-xs">شفافیت</Label>
                            <Slider
                              value={[activeTextData.opacity * 100]}
                              onValueChange={([value]) => {
                                setTexts(
                                  texts.map((t) =>
                                    t.id === activeTextData.id
                                      ? { ...t, opacity: value / 100 }
                                      : t
                                  )
                                );
                              }}
                              min={10}
                              max={100}
                              step={5}
                              className="mt-2"
                            />
                            <p className="text-xs text-gray-500 text-center mt-1">
                              {activeTextData.opacity * 100}%
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              activeTextData.fontWeight === "bold"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              setTexts(
                                texts.map((t) =>
                                  t.id === activeTextData.id
                                    ? {
                                        ...t,
                                        fontWeight:
                                          t.fontWeight === "bold"
                                            ? "normal"
                                            : "bold",
                                      }
                                    : t
                                )
                              );
                            }}
                          >
                            <Bold className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              activeTextData.fontStyle === "italic"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              setTexts(
                                texts.map((t) =>
                                  t.id === activeTextData.id
                                    ? {
                                        ...t,
                                        fontStyle:
                                          t.fontStyle === "italic"
                                            ? "normal"
                                            : "italic",
                                      }
                                    : t
                                )
                              );
                            }}
                          >
                            <Italic className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* لیست متن‌ها */}
                  <div className="space-y-2">
                    {texts.map((text) => (
                      <div
                        key={text.id}
                        className={`p-2 rounded border text-sm cursor-pointer transition-colors ${
                          activeText === text.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveText(text.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{text.content}</span>
                          <Move className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* دکمه دانلود */}
                <Button
                  onClick={downloadImage}
                  className="w-full"
                  size="lg"
                  disabled={!image}
                >
                  <Download className="ml-2 h-5 w-5" />
                  دانلود عکس نهایی
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* پیش‌نمایش */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  پیش‌نمایش زنده
                </CardTitle>
                <CardDescription>
                  عکس را درگ کنید و متن‌ها را با موس جابجا کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={previewRef}
                  className="relative bg-gray-100 rounded-lg p-4 min-h-[500px] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300"
                  onMouseLeave={endDrag}
                >
                  {image ? (
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto rounded-lg shadow-xl"
                      />

                      {/* دستگیره‌های متن برای درگ */}
                      {texts.map((text) => (
                        <div
                          key={text.id}
                          style={{
                            position: "absolute",
                            left: `${text.x - 50}px`,
                            top: `${text.y - 30}px`,
                            cursor: "move",
                          }}
                          onMouseDown={(e) => startDrag(e, text.id)}
                        >
                          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                            <Move className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{text.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        هنوز عکسی انتخاب نشده
                      </h3>
                      <p className="text-gray-500 mb-6">
                        برای شروع، یک عکس از قسمت تنظیمات آپلود کنید
                      </p>
                      <Button onClick={() => fileInputRef.current.click()}>
                        آپلود عکس
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
