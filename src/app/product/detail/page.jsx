import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Icon,
  IconButton,
  Image,
  Text,
  Badge,
  Avatar,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";

// 🚨🚨🚨 Element type is invalid 오류 해결을 위해 Named Import 재확인 🚨🚨🚨
// 만약 이 두 줄에서 오류가 난다면, 중괄호를 빼고 Default Import로 바꿔야 합니다.
import { useAuth } from "../../../hooks/common/useAuth";
import { useBookList } from "../../../hooks/common/useBookList";

// 📚 상세 정보 페이지 Mock 데이터 (DB 데이터가 없을 때를 대비)
const MOCK_DETAIL_TABS_DATA = {
  description: `이 책은 독자들에게 깊은 감동과 인사이트를 제공하는 훌륭한 작품입니다. 
      저자의 독특한 시각과 섬세한 문체가 돋보이며, 현대 사회의 다양한 이슈들을 
      예리하게 통찰합니다. 페이지를 넘길 때마다 새로운 발견과 깨달음이 있어 
      독서의 즐거움을 만끽할 수 있습니다.`,
  reviews: [
    {
      id: 1,
      author: "독서광123",
      rating: 5,
      date: "2025-01-15",
      content: "정말 감동적인 책이었습니다. 강력 추천합니다!",
      avatar: "https://bit.ly/dan-abramov",
    },
    {
      id: 2,
      author: "책벌레",
      rating: 4,
      date: "2025-01-10",
      content: "내용이 알차고 좋았어요. 다만 중반부가 조금 지루했습니다.",
      avatar: "https://bit.ly/kent-c-dodds",
    },
    {
      id: 3,
      author: "리더777",
      rating: 5,
      date: "2025-01-05",
      content: "인생 책으로 등극! 여러 번 읽고 싶네요.",
      avatar: "https://bit.ly/ryan-florence",
    },
  ],
  faqs: [
    {
      id: 1,
      question: "배송은 얼마나 걸리나요?",
      answer: "일반적으로 주문 후 2-3일 내에 배송됩니다.",
    },
    {
      id: 2,
      question: "반품/교환이 가능한가요?",
      answer:
        "상품 수령 후 7일 이내 미개봉 상태에 한해 반품/교환이 가능합니다.",
    },
  ],
};

// 🚨 제공해주신 책 데이터를 구조적으로 정의
const DEFAULT_BOOK_DATA = {
  author: "조 내버로, 마빈 칼린스 (지은이), 박정길 (옮긴이)",
  categoryName: "국내도서>자기계발>인간관계>교양심리학",
  cover: "https://image.aladin.co.kr/product/772/58/coversum/8901110806_1.jpg",
  description:
    "전직 FBI요원이자 행동전문가인 조 내버로가 상대방의 몸짓과 표정을 읽음으로써 사람의 마음을 간파해 효과적인 커뮤니케이션을 할 수 있는 기술을 담은 책이다. ...", // 실제 긴 내용은 DetailPage 내에서 MOCK_DETAIL_TABS_DATA.description 대신 사용됨.
  id: "9788901110806",
  link: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=7725851&partner=openAPI&start=api",
  priceStandard: 14000,
  pubDate: "2010-09-13",
  publisher: "리더스북",
  salesCount: 31,
  stock: 7,
  title: "FBI 행동의 심리학 - 말보다 정직한 7가지 몸의 단서",
  // Mock 탭 데이터도 추가
  ...MOCK_DETAIL_TABS_DATA,
};

const ProductDetail = () => {
  const { idx } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // useBookList는 실제로 데이터를 불러오지 못할 수 있으므로, 기본 데이터를 사용
  const { books, loading: dataLoading } = useBookList({
    pageSize: 1,
    id: idx,
  });

  // DB에서 가져온 책 데이터 (첫 번째 요소 사용)
  const bookFromDB = books?.[0];

  const [isWished, setIsWished] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (bookFromDB) {
      console.log(bookFromDB, "DB에서 불러온 단일 책 데이터");
    }
  }, [bookFromDB]);

  // 최종적으로 렌더링에 사용할 데이터 (DB 데이터가 있으면 사용, 없으면 Default Mock 데이터 사용)
  const detailData = bookFromDB
    ? {
        ...bookFromDB,
        // DB에 탭 정보(reviews, faqs)가 없으면 Mock 데이터를 병합
        reviews: bookFromDB.reviews || MOCK_DETAIL_TABS_DATA.reviews,
        faqs: bookFromDB.faqs || MOCK_DETAIL_TABS_DATA.faqs,
      }
    : DEFAULT_BOOK_DATA; // 🚨 DB 데이터가 로딩 중이거나 없을 경우 제공해주신 Mock 데이터를 사용

  // 로그인 필요 시 바로 로그인 페이지로 이동
  const handleBuyNow = () => {
    if (user) {
      navigate("/kt_3team_project_2025/pay");
    } else {
      navigate("/kt_3team_project_2025/login");
    }
  };

  // 장바구니 로직: 로그인 필요 시 바로 로그인 페이지로 이동
  const handleAddToCart = () => {
    if (user) {
      alert(`${detailData.title}이(가) 장바구니에 담겼습니다.`); // 🚨 alert로 대체
      // TODO: 실제 장바구니에 추가하는 로직
    } else {
      navigate("/kt_3team_project_2025/login");
    }
  };

  // 찜하기 로직: 로그인 필요 시 바로 로그인 페이지로 이동
  const toggleWishlist = () => {
    if (user) {
      setIsWished(!isWished);
      // TODO: 실제 위시리스트 추가/제거 로직
    } else {
      navigate("/kt_3team_project_2025/login");
    }
  };

  // 로딩 상태 처리
  if (dataLoading && !bookFromDB) {
    // 데이터 로딩 중이고, 기존 데이터도 없을 때만 로딩 표시
    return (
      <Container maxW="1200px" py="100px">
        <Text fontSize="xl">상품 데이터 로딩 중...</Text>
      </Container>
    );
  }

  // 데이터 없음 처리 (심지어 Mock 데이터도 없을 경우, 이럴 일은 거의 없음)
  if (!detailData.id) {
    return (
      <Container maxW="1200px" py="100px">
        <Text fontSize="xl">
          상품 데이터를 불러올 수 없거나 존재하지 않습니다. (ID: {idx})
        </Text>
        <Button mt="4" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </Container>
    );
  }

  const Separator = () => <Box borderBottom="1px solid #e2e8f0" my="24px" />;

  const isReviewDataValid = Array.isArray(detailData.reviews);
  const totalReviews = isReviewDataValid ? detailData.reviews.length : 0;

  const averageRating =
    totalReviews > 0
      ? (
          detailData.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  return (
    <Container maxW="1200px" p="0" margin="100px auto">
      {/* 상품 상세 정보 */}
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap="60px"
        mb="80px"
      >
        {/* 왼쪽: 이미지 */}
        <Box>
          <Box
            width="100%"
            height="600px"
            overflow="hidden"
            border="1px solid #eee"
            bgColor="var(--bg-color)"
          >
            <Image
              src={detailData.cover || "/no-image.png"}
              alt={detailData.title}
              w="100%"
              h="100%"
              objectFit="contain"
            />
          </Box>
        </Box>

        {/* 오른쪽: 상품 정보 */}
        <VStack align="stretch" spacing="24px">
          <Box>
            <Text fontSize="var(--font-small)" color="gray.600" mb="2">
              {detailData.categoryName || "도서"}
            </Text>
            <Text fontSize="var(--font-larger)" fontWeight="700" mb="3">
              {detailData.title}
            </Text>
            <Text fontSize="var(--font-medium)" color="gray.600">
              {detailData.author} | {detailData.publisher || "출판사"} |{" "}
              {detailData.pubDate || "날짜 미상"}
            </Text>
          </Box>

          <Separator />

          {/* 가격 정보 (priceStandard만 사용) */}
          <Box>
            <Flex alignItems="baseline" gap="3" mb="2">
              <Text fontSize="28px" fontWeight="bold" color="var(--main-color)">
                {(detailData.priceStandard ?? 0).toLocaleString()}원
              </Text>
            </Flex>
          </Box>

          <Separator />

          {/* 재고 정보 */}
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="var(--font-medium)" fontWeight="600">
              재고
            </Text>
            <HStack>
              <Badge
                colorScheme={detailData.stock > 10 ? "green" : "orange"}
                fontSize="md"
                px="3"
                py="1"
              >
                {detailData.stock > 0 ? `${detailData.stock}권 남음` : "품절"}
              </Badge>
            </HStack>
          </Flex>

          <Separator />

          {/* 버튼 영역 */}
          <VStack spacing="12px" pt="20px">
            <Flex gap="12px" width="100%">
              <IconButton
                aria-label="찜하기"
                icon={
                  <Icon
                    as={isWished ? IoIosHeart : IoIosHeartEmpty}
                    boxSize="6"
                  />
                }
                variant="outline"
                colorScheme="red"
                size="lg"
                onClick={toggleWishlist}
                isDisabled={detailData.stock === 0}
              />
              <Button
                leftIcon={<Icon as={AiOutlineShoppingCart} boxSize="5" />}
                bgColor="var(--sub-color)"
                size="lg"
                flex="1"
                onClick={handleAddToCart}
                isDisabled={detailData.stock === 0}
              >
                장바구니
              </Button>
              <Button
                bgColor="var(--main-color)"
                size="lg"
                flex="1"
                onClick={handleBuyNow}
                isDisabled={detailData.stock === 0}
              >
                바로구매
              </Button>
            </Flex>
          </VStack>
        </VStack>
      </Grid>

      {/* 탭 메뉴 */}
      <Box borderTop="2px solid var(--main-color)" pt="40px">
        <Flex gap="20px" mb="40px" borderBottom="1px solid #eee">
          {["description", "reviews", "faq"].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              fontSize="var(--font-medium)"
              fontWeight={activeTab === tab ? "700" : "400"}
              color={activeTab === tab ? "var(--main-color)" : "gray.600"}
              borderBottom={
                activeTab === tab ? "3px solid var(--main-color)" : "none"
              }
              borderRadius="0"
              pb="12px"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description"
                ? "상품설명"
                : tab === "reviews"
                ? `리뷰 (${detailData.reviews?.length ?? 0})`
                : `FAQ (${detailData.faqs?.length ?? 0})`}
            </Button>
          ))}
        </Flex>

        {/* 상품 설명 / 리뷰 / FAQ 내용 */}
        {activeTab === "description" && (
          <Box py="40px">
            <Text
              fontSize="var(--font-medium)"
              lineHeight="1.8"
              whiteSpace="pre-line"
            >
              {detailData.description}
            </Text>
          </Box>
        )}

        {activeTab === "reviews" && (
          <VStack spacing="30px" align="stretch" py="40px">
            <Flex justifyContent="space-between" alignItems="center" mb="20px">
              <Text fontSize="var(--font-medium)" fontWeight="600">
                전체 리뷰 {totalReviews}개
              </Text>
              <Text fontSize="var(--font-medium)" color="var(--main-color)">
                평균 ⭐ {averageRating}
              </Text>
            </Flex>

            {totalReviews > 0 ? (
              detailData.reviews.map((review) => (
                <Box
                  key={review.id}
                  p="24px"
                  border="1px solid #eee"
                  borderRadius="8px"
                  bgColor="var(--bg-color)"
                >
                  <Flex gap="16px" mb="16px">
                    <Avatar src={review.avatar} size="md" />
                    <Box flex="1">
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb="8px"
                      >
                        <Text fontWeight="600">{review.author}</Text>
                        <Text fontSize="var(--font-small)" color="gray.500">
                          {review.date}
                        </Text>
                      </Flex>
                      <Text color="var(--main-color)" mb="8px">
                        {"⭐".repeat(review.rating)}
                      </Text>
                      <Text fontSize="var(--font-medium)" lineHeight="1.6">
                        {review.content}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text textAlign="center" py="40px" color="gray.500">
                아직 등록된 리뷰가 없습니다.
              </Text>
            )}
          </VStack>
        )}

        {activeTab === "faq" && (
          <VStack spacing="20px" align="stretch" py="40px">
            {detailData.faqs?.length > 0 ? (
              detailData.faqs.map((faq) => (
                <Box
                  key={faq.id}
                  p="24px"
                  border="1px solid #eee"
                  borderRadius="8px"
                  bgColor="var(--bg-color)"
                >
                  <Text
                    fontSize="var(--font-medium)"
                    fontWeight="600"
                    mb="12px"
                    color="var(--main-color)"
                  >
                    Q. {faq.question}
                  </Text>
                  <Text
                    fontSize="var(--font-medium)"
                    color="gray.700"
                    pl="16px"
                  >
                    A. {faq.answer}
                  </Text>
                </Box>
              ))
            ) : (
              <Text textAlign="center" py="40px" color="gray.500">
                등록된 FAQ가 없습니다.
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;
