"use client";
import { useScroll } from "@/contexts/ScrollContext";
import { FaArrowUp } from "react-icons/fa6";

const ScrollTopBtn = () => {
  const { scrollContainerRef } = useScroll();

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-20 z-50 bg-(--main-color) text-white rounded-full w-50 h-50 flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
      aria-label="맨 위로 이동"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollTopBtn;
