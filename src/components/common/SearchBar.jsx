"use client";

import React from "react";
import { IoIosSearch } from "react-icons/io";
import useSearchForm from "@/hooks/common/useSearchForm";

export default function SearchBar() {
  const { query, setQuery, handleSearch } = useSearchForm();

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-[600px]">
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-40 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
      >
        <IoIosSearch className="text-2xl text-gray-400" />
      </button>
    </form>
  );
}
