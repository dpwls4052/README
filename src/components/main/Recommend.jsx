"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useRouter } from "next/navigation";
import noimg from "@/assets/no_image.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { useBooks } from "@/hooks/book/useBooks";
import RecommendSkeleton from "./RecommendSkeleton";

export default function Recommend() {
  const router = useRouter();
  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };
  const { books, loading } = useBooks();

  const randomBooks = useMemo(() => {
    if (!books?.length) return [];
    const pool = [...books];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 6);
  }, [books]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="flex flex-col lg:flex-row w-full mt-8 lg:mt-12 gap-8 lg:gap-80 px-4 lg:px-0">
      {/* LEFT AREA */}
      <div className="flex flex-col lg:justify-between">
        <div className="text-center lg:text-right">
          <div className="mb-4 lg:mb-8">
            <h2 className="text-xl lg:text-[24px] font-semibold">
              11월의 추천도서
            </h2>
          </div>

          <button
            className="bg-transparent border-0 cursor-pointer mb-4 lg:mb-8 text-black text-[var(--font-medium)] hover:underline"
            onClick={() => router.push("/books/recommend")}
          >
            더보기 →
          </button>
        </div>
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 lg:mb-80">
          <button
            ref={prevRef}
            className="bg-transparent border-0 cursor-pointer"
          >
            <TfiArrowCircleLeft size={25} />
          </button>

          <div
            className="custom-pagination"
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
      <div className="flex-1 w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
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
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {loading
            ? Array.from({ length: 8 }, (_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <RecommendSkeleton />
                </SwiperSlide>
              ))
            : randomBooks.map((book) => (
                <SwiperSlide key={book.id}>
                  <div
                    className="w-full max-w-[200px] mx-auto h-[280px] rounded-md overflow-hidden hover:cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    onClick={() => goDetail(book.bookId)}
                  >
                    <Image
                      src={
                        book.highResCover ||
                        book.cover?.replace(/coversum/gi, "cover500") ||
                        noimg
                      }
                      alt={book.title || "도서"}
                      className="object-cover w-full h-full"
                      width={200}
                      height={280}
                    />
                  </div>

                  <div className="flex flex-col items-start mt-4 text-left max-w-[200px] mx-auto">
                    <p className="text-base lg:text-lg font-bold overflow-hidden text-ellipsis w-full line-clamp-2">
                      {book.title || "제목 미상"}
                    </p>

                    <p className="mt-1 text-sm text-gray-600 overflow-hidden text-ellipsis w-full line-clamp-1">
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
