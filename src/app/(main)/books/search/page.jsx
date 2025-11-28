"use client";

import Navigation from "@/components/main/Navigation";
import { Suspense } from "react";
import SearchContent from "@/components/books/SearchContent";

export const dynamic = "force-dynamic";

export default function SearchResultPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </>
  );
}