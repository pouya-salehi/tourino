"use client";

import * as React from "react";
import { cn2 } from "@/lib/utils";

const DialogContext = React.createContext();

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div onClick={() => onOpenChange(true)} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DialogContent({ children, className }) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
      />

      {/* content */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg animate-in fade-in-50 zoom-in-50 dark:bg-neutral-900",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-xl font-bold leading-none tracking-tight">
      {children}
    </h2>
  );
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-neutral-500 mt-1">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}

export function DialogClose({ children }) {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <button onClick={() => onOpenChange(false)} className="cursor-pointer">
      {children}
    </button>
  );
}
