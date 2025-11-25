"use client";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="relative flex-1 w-full max-w-600">
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-40 pr-12 pl-20 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-(--main-color)"
      />
      <button
        type="submit"
        className="absolute -translate-y-1/2 bg-transparent border-none cursor-pointer right-15 top-1/2"
      >
        <IoIosSearch className="text-2xl text-gray-400" />
      </button>
    </form>
  );
}
