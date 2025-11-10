"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { useBookList } from "@/hooks/common/useBookList";

export default function Recommend() {
  const { books, loading } = useBookList({
    pageSize: 6,
    orderField: "createdAt",
    orderDirection: "desc",
  });

  const randomBooks = useMemo(() => {
    if (!books?.length) return [];
    const pool = [...books];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 10);
  }, [books]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="flex w-full gap-80 mt-12">
      {/* LEFT AREA */}
      <div className="flex flex-col justify-between">
        <div className="text-right">
          <div className="mb-8">
            <h2 className="text-[24px] font-semibold">11월의 추천도서</h2>
          </div>

          <button className="bg-transparent border-0 cursor-pointer mb-8 text-black text-[var(--font-medium)] hover:underline">
            더보기 →
          </button>
        </div>
        <div className="mb-80 flex items-center gap-2">
          <button
            ref={prevRef}
            className="bg-transparent border-0 cursor-pointer"
          >
            <TfiArrowCircleLeft size={25} />
          </button>

          <div
            className="custom-pagination "
            style={{
              width: "100px",
              height: "20px",
              "--swiper-theme-color": "var(--main-color)",
            }}
          />

          <button
            ref={nextRef}
            className="bg-transparent border-0 cursor-pointer"
          >
            <TfiArrowCircleRight size={25} />
          </button>
        </div>
      </div>

      {/* RIGHT AREA (SLIDER) */}
      <div className="contents">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          pagination={{ el: ".custom-pagination", clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {(loading
            ? Array.from({ length: 8 }, (_, i) => ({ id: `skeleton-${i}` }))
            : randomBooks
          ).map((book) => (
            <SwiperSlide key={book.id}>
              <div className="w-[200px] h-[280px] rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={book.cover}
                  alt={book.title || "도서"}
                  className="w-full h-full object-cover"
                  width={200}
                  height={280}
                />
              </div>

              <div className="mt-4 flex flex-col items-start text-left">
                <p
                  className="text-lg font-bold overflow-hidden text-ellipsis w-[180px]
                    line-clamp-2"
                >
                  {book.title || "제목 미상"}
                </p>

                <p
                  className="mt-1 text-sm text-gray-600 overflow-hidden text-ellipsis w-[180px]
                    line-clamp-1"
                >
                  {book.author || book.writer || "작자 미상"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
