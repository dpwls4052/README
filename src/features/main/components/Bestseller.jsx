import {
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Grid,
  Icon,
  IconButton,
  Image,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../hooks/common/useAuth";
import { useBookList } from "../../../hooks/common/useBookList";

const Bestseller = () => {
  const { books, loading } = useBookList({
    pageSize: 10,
    orderField: "salesCount",
    orderDirection: "desc",
  });

  const [openCart, setOpenCart] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBuyNow = () => {
    if (user) {
      // 로그인되어 있으면 결제 페이지로 이동
      navigate("/kt_3team_project_2025/pay");
    } else {
      // 로그인 안 되어 있으면 로그인 모달 띄움
      setOpenLogin(true);
    }
  };

  return (
    <Container p="0" margin="100px 0">
      <Text fontSize="var(--font-larger)" fontWeight="600">
        베스트셀러
      </Text>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(5, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap="30px"
        margin="80px 0"
      >
        {books.map((book) => (
          <Box
            key={book.id}
            bgColor="var(--bg-color)"
            p="4"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="12px"
          >
            <Box
              width="100%"
              height="300px"
              overflow="hidden"
              border="1px solid #eee"
            >
              <Image
                src={book.cover || "/no-image.png"}
                alt={book.title}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Flex alignItems="flex-start" justifyContent="space-between">
              <Text
                fontSize="var(--font-medium)"
                fontWeight="bold"
                textAlign="left"
                width="180px"
                css={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {book.title}
              </Text>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="찜"
                css={{
                  _icon: {
                    width: "4",
                    height: "4",
                  },
                }}
              >
                <Icon as={IoIosHeartEmpty} color="red" />
              </IconButton>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text
                fontSize="var(--font-small)"
                textAlign="left"
                width="150px"
                css={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {book.author}
              </Text>
              <Text fontSize="var(--font-small)">
                {(book.priceStandard ?? 0).toLocaleString()}원
              </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" gap="2">
              <Button
                bgColor="var(--sub-color)"
                flex="1"
                onClick={() => setOpenCart(true)} // ← 클릭 시 열기
              >
                장바구니
              </Button>

              <Button
                bgColor="var(--main-color)"
                flex="1"
                onClick={handleBuyNow}
              >
                바로구매
              </Button>
              <Modal
                title="선택한 상품을 장바구니에 담았어요."
                open={openCart}
                onOpenChange={(e) => setOpenCart(e.open)} // Chakra Dialog는 e.open으로 상태 전달
                confirmText="장바구니 이동"
                cancelText="취소"
                onConfirm={() => {
                  navigate("/kt_3team_project_2025/cart");
                  setOpenCart(false);
                }}
                size="xl"
              >
                장바구니 페이지로 이동하시겠습니까?
              </Modal>
              <Modal
                title="로그인이 필요한 서비스입니다."
                open={openLogin}
                onOpenChange={(e) => setOpenLogin(e.open)}
                confirmText="로그인 페이지로 이동"
                cancelText="취소"
                onConfirm={() => {
                  navigate("/kt_3team_project_2025/login");
                  setOpenLogin(false);
                }}
                size="md"
              >
                로그인 페이지로 이동하시겠습니까?
              </Modal>
            </Flex>
          </Box>
        ))}
      </Grid>
      {/* <Box display="flex" justifyContent="end">
        <Button bgColor="var(--main-color)">더보기 +</Button>
      </Box> */}
    </Container>
  );
};

export default Bestseller;
