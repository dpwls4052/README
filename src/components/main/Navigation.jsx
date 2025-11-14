"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="py-3 w-full mt-20 z-10 mb-20">
      <ul className="max-w-[1200px] mx-auto flex justify-center gap-[120px]">
        <li>
          <Link
            href="/books/domestic"
            className="font-semibold hover:no-underline"
          >
            국내도서
          </Link>
        </li>

        <li>
          <Link
            href="/books/foreign"
            className="font-semibold hover:no-underline"
          >
            해외도서
          </Link>
        </li>

        <li>
          <Link
            href="/books/recommend"
            className="font-semibold hover:no-underline"
          >
            이달의 추천도서
          </Link>
        </li>

        <li>
          <Link
            href="/books/season"
            className="font-semibold hover:no-underline"
          >
            계절도서
          </Link>
        </li>
      </ul>
    </nav>
  );
}
