"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/books/domestic", label: "국내도서" },
    { href: "/books/foreign", label: "외국도서" },
    { href: "/books/recommend", label: "이달의 추천도서" },
    { href: "/books/season", label: "계절도서" },
  ];

  return (
    <nav className="w-full py-3 my-30">
      <ul className="max-w-1200 w-full mx-auto flex justify-center gap-[120px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`font-semibold text-20 hover:no-underline px-16 py-8 rounded transition-colors ${
                  isActive
                    ? "bg-[var(--main-color)] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
