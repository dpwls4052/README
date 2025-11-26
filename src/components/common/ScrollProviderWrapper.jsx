"use client";
import { ScrollProvider } from "@/contexts/ScrollContext";

export default function ScrollProviderWrapper({ children }) {
  return <ScrollProvider>{children}</ScrollProvider>;
}
