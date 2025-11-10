"use client";

import Image from "next/image";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import banner4 from "@/assets/banner4.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {
  return (
    <div className="w-[1200px] rounded-xl overflow-hidden">
      <Swiper
        className="home-banner"
        style={{
          "--swiper-theme-color": "#fff",
        }}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        loop
      >
        <SwiperSlide>
          <Image
            src={banner1}
            alt="배너1"
            className="w-full h-auto object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner2}
            alt="배너2"
            className="w-full h-auto object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner3}
            alt="배너3"
            className="w-full h-auto object-cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner4}
            alt="배너4"
            className="w-full h-auto object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
