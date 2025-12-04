"use client";
import { useEffect } from "react";
import { useToast } from "@/provider/ToastProvider";

export default function InitToastGlobal() {
  const api = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__toast = api;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.__toast;
      }
    };
  }, [api]);

  return null;
}
