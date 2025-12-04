"use client";

import { useState, useRef, useEffect } from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children, onClick }) {
  if (asChild) {
    return children;
  }
  return <button onClick={onClick}>{children}</button>;
}

export function DropdownMenuContent({
  children,
  open,
  align = "end",
  className = "",
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (open && contentRef.current) {
      const content = contentRef.current;
      const rect = content.getBoundingClientRect();

      // اگر از سمت چپ خارج میشه، موقعیت رو تنظیم کن
      if (rect.left < 10) {
        content.style.left = "10px";
        content.style.right = "auto";
      }
    }
  }, [open]);

  if (!open) return null;

  const alignment =
    align === "start"
      ? "left-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "right-0";

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-md bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/10 animate-fade-in ${alignment} ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children }) {
  return (
    <div className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-[1px] bg-gray-200 dark:bg-zinc-700" />;
}

export function DropdownMenuGroup({ children }) {
  return <div className="py-1">{children}</div>;
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
    >
      {children}
    </button>
  );
}

export function DropdownMenuShortcut({ children }) {
  return <span className="opacity-60 text-xs">{children}</span>;
}

export function DropdownMenuSub({ children }) {
  return <div className="absolute">{children}</div>;
}

export function DropdownMenuSubTrigger({ children, onOpen }) {
  return (
    <button
      onMouseEnter={onOpen}
      className="w-full px-4 py-2 text-sm flex justify-between hover:bg-gray-100 dark:hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}

export function DropdownMenuPortal({ children }) {
  return <div className="absolute top-0">{children}</div>;
}
