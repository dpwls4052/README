import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "자바스크립트 완벽 가이드",
      price: 45000,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "리액트를 다루는 기술",
      price: 36000,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "클린 코드",
      price: 29000,
      image: "https://via.placeholder.com/80",
    },
  ]);

  const handleToggleHeart = (id, name) => {
    setItems(items.filter((item) => item.id !== id));
    alert(`${name}이(가) 위시리스트에서 제거되었습니다`);
  };

  const handleAddToCart = (name) => {
    alert(`${name}이(가) 장바구니에 추가되었습니다`);
    // TODO: 실제 장바구니에 추가하는 로직
  };

  const itemsTotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <Box minH="100vh" py="40px">
      <Box maxW="1200px" mx="auto" px="20px">
        <Flex gap="40px" direction={{ base: "column", lg: "row" }}>
          {/* 왼쪽 영역 - 위시리스트 목록 */}
          <Box
            flex="2"
            bg="var(--bg-color)"
            p="20px"
            borderRadius="16px"
            boxShadow="sm"
          >
            <Heading size="xl" mb="20px" color="black" fontSize={"24px"}>
              위시리스트
            </Heading>

            {items.length === 0 ? (
              <Box textAlign="center" py="40px">
                <Text color="gray.500" fontSize="lg">
                  위시리스트가 비어 있습니다.
                </Text>
              </Box>
            ) : (
              <VStack gap="0" align="stretch">
                {items.map((item, index) => (
                  <Box key={item.id}>
                    <Flex justify="space-between" align="center" py="16px">
                      <Flex align="center" gap="16px">
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="80px"
                          borderRadius="8px"
                          objectFit="cover"
                        />
                        <VStack align="start" gap="4px">
                          <Text fontSize="md" fontWeight="medium" color="black">
                            {item.name}
                          </Text>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="var(--main-color)"
                          >
                            {item.price.toLocaleString()}원
                          </Text>
                        </VStack>
                      </Flex>

                      <HStack gap="8px">
                        <IconButton
                          aria-label="위시리스트에서 제거"
                          size="md"
                          onClick={() => handleToggleHeart(item.id, item.name)}
                          bg="transparent"
                          color="#e63946"
                          _hover={{ bg: "rgba(230, 57, 70, 0.1)" }}
                        >
                          <FaHeart size={22} />
                        </IconButton>
                        <IconButton
                          aria-label="장바구니에 추가"
                          size="md"
                          onClick={() => handleAddToCart(item.name)}
                          bg="var(--sub-color)"
                          color="#fff"
                          _hover={{ bg: "#6d7a58" }}
                        >
                          <FiShoppingCart size={20} />
                        </IconButton>
                      </HStack>
                    </Flex>
                    {index < items.length - 1 && (
                      <Box borderBottom="1px solid" borderColor="gray.200" />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* 오른쪽 영역 - 요약 정보 */}
          <Box
            flex="1"
            bg="var(--bg-color)"
            p="20px"
            borderRadius="16px"
            boxShadow="sm"
            h="fit-content"
            position={{ lg: "sticky" }}
            top="20px"
          >
            <Heading size="xl" mb="20px" color="black" fontSize={"24px"}>
              위시리스트 정보
            </Heading>

            <VStack gap="12px" align="stretch" mb="16px">
              <Flex justify="space-between">
                <Text color="black">상품 수</Text>
                <Text fontWeight="bold" color="black">
                  {items.length}개
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="black">총 금액</Text>
                <Text fontWeight="bold" color="var(--main-color)">
                  {itemsTotal.toLocaleString()}원
                </Text>
              </Flex>
            </VStack>

            <Box borderBottom="1px solid" borderColor="gray.200" mb="16px" />

            <Button
              size="lg"
              width="100%"
              onClick={() =>
                (window.location.href = "/kt_3team_project_2025/cart")
              }
              bg="var(--main-color)"
              color="var(--bg-color)"
              _hover={{ bg: "var(--sub-color)" }}
            >
              장바구니로 이동
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Wishlist;
