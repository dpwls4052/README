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
    <div style={{ display: "flex", gap: "80px", width: "100%", marginTop: "50px" }}>
      {/* LEFT AREA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "250px" }}>
        <div style={{ marginBottom: "10px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700" }}>11월의 추천도서</h2>
        </div>

        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          더보기 →
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button ref={prevRef} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <TfiArrowCircleLeft size={40} />
          </button>

          <div className="custom-pagination" style={{ width: "60px", height: "20px" }} />

          <button ref={nextRef} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <TfiArrowCircleRight size={40} />
          </button>
        </div>
      </div>

      {/* RIGHT AREA (SLIDER) */}
      <div style={{ flex: 1 }}>
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
              <div style={{ width: "100%", height: "300px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                <Image
                  src={book.cover || "/no-image.png"}
                  alt={book.title || "도서"}
                  width={300}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {book.title || "제목 미상"}
                </p>

                <p
                  style={{
                    marginTop: "5px",
                    fontSize: "14px",
                    color: "#666",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
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
