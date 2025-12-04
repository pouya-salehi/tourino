import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  🎨 Palette:
  cyan:    #06b6d4
  indigo:  #6366f1
  violet:  #8b5cf6
*/

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2 whitespace-nowrap 
  rounded-xl text-sm font-semibold transition-all duration-200
  disabled:pointer-events-none disabled:opacity-50
  shadow-md hover:shadow-lg active:scale-[0.97]
  outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40
  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        // 🌈 دکمه اصلی: گرادیان بین Cyan → Indigo
        default: `
          bg-gradient-to-r from-indigo-500 to-purple-500
          text-white 
          hover:from-cyan-400 hover:to-indigo-400
        `,

        // ⚠️ خطر
        destructive: `
          bg-red-500 text-white 
          hover:bg-red-600
          focus-visible:ring-red-400/40
        `,

        // 🧊 outline گرادیانی + حالت شیشه‌ای
        outline: `
          border border-indigo-400 text-indigo-600
          hover:bg-indigo-50/40
          dark:hover:bg-indigo-400/10
        `,

        // 🌫 secondary در تونالیته Violet
        secondary: `
          bg-violet-500/20 text-violet-700 
          hover:bg-violet-500/30
          dark:text-violet-300
        `,

        // 🫧 ghost شیشه ای
        ghost: `
          text-indigo-600
          hover:bg-indigo-100/40
          dark:hover:bg-indigo-400/10
        `,

        // 🔗 لینک
        link: `
          text-indigo-500 underline-offset-4 hover:underline
        `,
      },

      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
