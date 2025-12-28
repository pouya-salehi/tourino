// components/panel/tour-detail/TourBookingCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  Phone,
  MessageCircle,
  Clock,
  UserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function TourBookingCard({ tour, peopleCount, setPeopleCount, formatDate }) {
  const totalPrice = tour.price * peopleCount;
  const discount = peopleCount >= 4 ? totalPrice * 0.1 : 0;
  const finalPrice = totalPrice - discount;
  const remainingSpots = tour.maxPeople
    ? Math.max(0, tour.maxPeople - 50)
    : null;

  return (
    <Card className="sticky top-24 shadow-xl rounded-4xl dark:border bg-transparent">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 mb-4">
            <Badge variant="destructive" className="animate-pulse px-4 py-2">
              ⚡ ویژه
            </Badge>
            <span className="text-sm font-semibold">تضمین بهترین قیمت</span>
          </div>

          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-black">
              {finalPrice.toLocaleString()}
            </span>
            <span className="text-gray-500">تومان</span>
          </div>

          {discount > 0 && (
            <div className="text-sm text-gray-500 line-through mb-2">
              {totalPrice.toLocaleString()} تومان
            </div>
          )}

          <div className="text-sm text-emerald-500 font-semibold mb-4 flex items-center text-center w-full justify-center">
            <UserRound /> قیمت به ازای هر نفر: {tour.price.toLocaleString()}{" "}
            تومان
          </div>
        </div>

        <Separator className="my-6" />

        {/* Booking Form */}
        <div className="space-y-6">
          {/* People Counter */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              تعداد نفرات
            </Label>
            <div className="flex items-center justify-between p-3 rounded-lg">
              <Button
                variant="outline"
                size="icon"
                className="dark:border-white dark:text-white"
                onClick={() => setPeopleCount((prev) => Math.max(1, prev - 1))}
                disabled={peopleCount <= 1}
              >
                -
              </Button>

              <div className="text-center">
                <div className="text-2xl font-bold">{peopleCount}</div>
                <div className="text-sm text-gray-500 dark:text-white">نفر</div>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="dark:border-white dark:text-white"
                onClick={() =>
                  setPeopleCount((prev) =>
                    tour.maxPeople
                      ? Math.min(tour.maxPeople, prev + 1)
                      : prev + 1
                  )
                }
                disabled={tour.maxPeople && peopleCount >= tour.maxPeople}
              >
                +
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4" />
              تاریخ سفر
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-transparent text-center">
                <div className="text-sm text-gray-500">شروع</div>
                <div className="font-bold">{formatDate(tour.startDate)}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-transparent text-center">
                <div className="text-sm text-gray-500">پایان</div>
                <div className="font-bold">{formatDate(tour.endDate)}</div>
              </div>
            </div>
          </div>

          {/* Remaining Spots */}
          {remainingSpots && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>ظرفیت باقی‌مانده</Label>
                <span className="text-sm font-semibold">
                  {remainingSpots} نفر
                </span>
              </div>
              <Progress
                value={(remainingSpots / tour.maxPeople) * 100}
                className="h-2"
              />
            </div>
          )}

          {/* CTA Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <CreditCard className="h-5 w-5 ml-2" />
                رزرو آنلاین تور
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="text-center p-6">
                <h3 className="text-2xl font-bold mb-4">
                  رزرو تور {tour.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  برای تکمیل رزرو، اطلاعات خود را وارد کنید
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Alternative Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 dark:text-white dark:border-white">
              <MessageCircle className="h-4 w-4 ml-2" />
              گفتگو
            </Button>
            <Button variant="outline" className="flex-1 dark:text-white dark:border-white">
              <Phone className="h-4 w-4 ml-2" />
              تماس
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-semibold">تضمین بهترین قیمت</div>
              <div className="text-sm text-gray-500">
                در صورت یافتن قیمت کمتر
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="font-semibold">پشتیبانی ۲۴ ساعته</div>
              <div className="text-sm text-gray-500">قبل، حین و پس از سفر</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourBookingCard;
