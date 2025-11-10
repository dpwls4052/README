import { Box, Image } from "@chakra-ui/react";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import banner4 from "@/assets/banner4.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = () => {
  return (
    <Box
      borderRadius="xl" // ✅ 외곽 둥글게
      overflow="hidden" // ✅ 이미지가 둥근 모서리 밖으로 안 나가게
      width="1200px"
    >
      <Swiper
        className="home-banner"
        style={{
          "--swiper-theme-color": "#fff",
        }}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        loop
      >
        <SwiperSlide>
          <Image
            src={banner1}
            alt="배너1"
            w="100%"
            h="auto"
            objectFit="cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner2}
            alt="배너2"
            w="100%"
            h="auto"
            objectFit="cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner3}
            alt="배너3"
            w="100%"
            h="auto"
            objectFit="cover"
          />
        </SwiperSlide>

        <SwiperSlide>
          <Image
            src={banner4}
            alt="배너4"
            w="100%"
            h="auto"
            objectFit="cover"
          />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
};

export default Banner;
