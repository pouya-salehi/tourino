"use client"
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
function Category() {
  const categories = [
    {
      title: "تور های کمپینگ",
      img: "./images/5.png",
    },
    {
      title: "تور های سافاری",
      img: "./images/4.png",
    },
    {
      title: "تور های کوهنوردی",
      img: "./images/1.png",
    },
    {
      title: "تور های صخره نوردی",
      img: "./images/2.png",
    },
    {
      title: "تور های رفتینگ",
      img: "./images/6.png",
    },
    {
      title: "تور های مسافرتی",
      img: "./images/3.png",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
      }}
      className="p-4"
    >
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {categories.map((c) => (
          <li
            className="shadow rounded-4xl flex p-4 relative h-72 mt-6 dark:shadow-none dark:border"
            key={c.title}
          >
            <div className="flex flex-col justify-end md:justify-between h-full w-fit">
              <span className="text-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text flex">
                <Quote
                  size={16}
                  className="text-black/50"
                  fill="#00d1d1"
                  strokeWidth={0}
                />
                {c.title}
                <Quote
                  size={16}
                  className="text-black/50 rotate-180"
                  fill="#00d1d1"
                  strokeWidth={0}
                />
              </span>
              <Button className="w-3xs cursor-pointer bg-transparent text-gray-500">رزرو تور</Button>
            </div>
            <div className="w-44 md:w-2xs absolute -top-12 left-10 md:-left-10">
              <img src={c.img} alt="" />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default Category;
