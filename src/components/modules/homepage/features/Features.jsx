import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PiDotOutlineThin } from "react-icons/pi";

import { Quote } from "lucide-react";
function Features() {
  return (
    <div className="px-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center shadow-none md:shadow-lg rounded-4xl  dark:shadow-none dark:border-none">
        <div className="">
          <img src="./images/edit.png" alt="" className="" />
        </div>
        <div className="w-full flex flex-col items-center text-center md:text-start">
          <h1 className="text-2xl md:text-5xl font-extrabold leading-snug md:leading-tight mb-6 text-gray-700 dark:text-white">
            <span className="flex items-center justify-center md:justify-start">
              <Quote
                size={16}
                className="text-black/50"
                fill="#00d1d1"
                strokeWidth={0}
              />
              داشبورد اختصاصی
              <Quote
                size={16}
                className="text-black/50 rotate-180"
                fill="#00d1d1"
                strokeWidth={0}
              />
            </span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 text-transparent bg-clip-text">
              همراه با اپلیکیشن ویرایشگر عکس و متن!
            </span>
            <ul className="mt-2 flex flex-col gap-2 items-center md:items-start">
              <li className="text-sm md:text-xl flex items-center">
                <PiDotOutlineThin />
                اپلیکیشن اختصاصی ثبت تور
              </li>
              <li className="text-sm md:text-xl flex items-center">
                <PiDotOutlineThin />
                تعامل کاربری
              </li>
              <li className="text-sm md:text-xl flex items-center">
                <PiDotOutlineThin />
                ثبتنام کاملا رایگان
              </li>
            </ul>
          </h1>
          <div className="flex items-center justify-center md:justify-start w-full gap-4">
            <Button href="/tours" className="cursor-pointer">
              <Link href="signup">همین حالا ثبت نام کن!</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
