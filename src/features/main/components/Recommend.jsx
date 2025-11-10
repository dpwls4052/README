import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { TfiArrowCircleLeft } from "react-icons/tfi";
import { TfiArrowCircleRight } from "react-icons/tfi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMemo, useRef } from "react";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import { useBookList } from "../../../hooks/common/useBookList";

const Recommend = () => {
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
    <Container display="flex" justifyContent="space-between" gap="100px" p={0}>
      <VStack
        align="center"
        spacing={6}
        flexShrink={0}
        justifyContent="space-between"
      >
        <Flex flexDirection="column" alignItems="flex-end" gap={4}>
          <Text fontSize="var(--font-larger)" fontWeight="600">
            11월의 추천도서
          </Text>
          <Box>
            <Button bg="none" color="#000" fontSize="var(--font-medium)" p={0}>
              더보기 →
            </Button>
          </Box>
        </Flex>
        <HStack display="flex" alignItems="center" gap={5} mb={40}>
          <ButtonWithIcon
            ref={prevRef}
            btnWidth="40px"
            btnHeight="40px"
            icon={TfiArrowCircleLeft}
            iconWidth={8}
            iconHeight={8}
            ariaLabel="이전"
            variant="ghost"
          ></ButtonWithIcon>
          <Box
            className="custom-pagination"
            style={{
              "--swiper-theme-color": "var(--main-color)",
            }}
          />
          <ButtonWithIcon
            ref={nextRef}
            btnWidth="40px"
            btnHeight="40px"
            icon={TfiArrowCircleRight}
            iconWidth={8}
            iconHeight={8}
            ariaLabel="이전"
            variant="ghost"
          ></ButtonWithIcon>
        </HStack>
      </VStack>
      <Box gap="50px" display="contents">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView="4"
          spaceBetween={50}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          speed={400}
          onBeforeInit={(swiper) => {
            // Swiper가 초기화되기 전에 버튼 ref 연결
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
        >
          {(loading
            ? Array.from({ length: 8 }, (_, i) => ({ id: `skeleton-${i}` }))
            : randomBooks
          ).map((book) => (
            <SwiperSlide key={book.id}>
              <Box height="320px" border="1px solid #eee">
                <Image
                  src={book.cover || "/no-image.png"}
                  alt={book.title || "도서"}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>
              <Flex
                flexDirection="column"
                alignItems="start"
                justifyContent="space-between"
                marginTop="20px"
              >
                <Text
                  fontSize="20px"
                  fontWeight="bold"
                  textAlign="left"
                  css={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  {book.title || "제목 미상"}
                </Text>
                <Text
                  fontSize="var(--font-medium)"
                  textAlign="left"
                  css={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  {" "}
                  {book.author || book.writer || "작자 미상"}
                </Text>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  );
};

export default Recommend;
