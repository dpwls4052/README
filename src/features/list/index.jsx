import { useParams } from "react-router-dom";
import { useBookList } from "../../hooks/common/useBookList";
import { useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoIosHeartEmpty } from "react-icons/io";
import Navigation from "@/features/Main/components/Navigation";

const CATEGORY_MAP = {
  domestic: { title: "국내도서", prefix: "국내도서" },
  foreign: { title: "해외도서", prefix: "외국도서" },
  season: { title: "계절도서", prefix: null }, //랜덤처리
  recommend: { title: "이달의 추천도서", prefix: null }, //랜덤처리
};

const BookList = () => {
  const { slug } = useParams();
  const config = CATEGORY_MAP[slug] ?? { title: "전체도서", prefix: null };

  const wantRandom = slug === "recommend" || slug === "season";

  const { books, loading, fetchBooks, hasNext } = useBookList({
    pageSize: 10,
    category: null,
    orderField: wantRandom ? "createdAt" : "salesCount",
    orderDirection: "desc",
  });

  const visibleBooks = useMemo(() => {
    let list = Array.isArray(books) ? books : [];

    // 접두사 필터 (prefix가 있을 때만)
    if (config.prefix) {
      list = list.filter((b) =>
        (b.categoryName ?? "").startsWith(config.prefix)
      );
    }

    if (!list.length) return [];

    if (wantRandom) {
      const pool = [...list];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 10);
    }

    return list;
  }, [books, config.prefix, wantRandom]);

  return (
    <>
      <Navigation />

      <Box p="80px 0" maxW="1200px" mx="auto">
        <Text fontSize="var(--font-larger)" fontWeight="bold" mb={10}>
          {config.title}
        </Text>

        {loading ? (
          <Flex justify="center" align="center" h="300px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <VStack>
            {visibleBooks.map((book) => (
              <Box
                key={book.id}
                p="3"
                display="flex"
                width="100%"
                justifyContent="space-between"
                borderBottom="1px solid #ccc"
                py={8}
                gap={14}
              >
                <HStack alignItems="flex-start" gap="20px">
                  <Image
                    src={book.cover || "/no-image.png"}
                    alt={book.title || "제목 미상"}
                    borderRadius="md"
                    w="140px"
                    h="200px"
                    objectFit="cover"
                    border="1px solid #eee"
                  />
                  <HStack
                    flexDirection="column"
                    alignItems="flex-start"
                    gap={4}
                  >
                    <Text
                      mt={3}
                      fontWeight="bold"
                      fontSize="var(--font-medium)"
                      noOfLines={2}
                      minW={0}
                    >
                      {book.title || "제목 미상"}
                    </Text>{" "}
                    <Box display="flex" alignItems="center" gap="10px">
                      <Text
                        fontSize="var(--font-small)"
                        color="gray.600"
                        noOfLines={1}
                        minW={0}
                      >
                        {book.author || "저자 미상"}
                      </Text>{" "}
                      <Text
                        fontSize="var(--font-small)"
                        color="gray.600"
                        noOfLines={1}
                        minW={0}
                      >
                        {book.pubDate}
                      </Text>
                    </Box>
                    <Text mt={1} fontSize="var(--font-medium)">
                      {(book.priceStandard ?? 0).toLocaleString()}원
                    </Text>
                  </HStack>
                </HStack>
                <Flex
                  alignItems="end"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap="2"
                >
                  <IconButton
                    variant="ghost"
                    size="xl"
                    aria-label="찜"
                    css={{
                      _icon: {
                        width: "6",
                        height: "6",
                      },
                    }}
                  >
                    <Icon as={IoIosHeartEmpty} color="red" />
                  </IconButton>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="10px"
                    w="200px"
                    h="100px"
                  >
                    <Button
                      bgColor="var(--sub-color)"
                      flex="1"
                      // onClick={() => setOpenCart(true)} // ← 클릭 시 열기
                    >
                      장바구니
                    </Button>

                    <Button
                      bgColor="var(--main-color)"
                      flex="1"
                      // onClick={handleBuyNow}
                    >
                      바로구매
                    </Button>
                  </Box>
                </Flex>
              </Box>
            ))}
            {hasNext && (
              <Box p="20px" textAlign="center" marginTop="20px">
                <Button
                  bg="var(--main-color)"
                  onClick={() => fetchBooks()}
                  w="200px"
                >
                  더보기 +
                </Button>
              </Box>
            )}
          </VStack>
        )}
      </Box>
    </>
  );
};

export default BookList;
