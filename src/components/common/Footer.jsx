import React from 'react';
import { Box, Container, Flex, Text, HStack, VStack, Heading } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box bg="var(--bg-color)" marginTop="120px" py="60px" borderTop="1px solid" borderColor="gray.200">
      <Container maxW="1200px">
        <Flex direction={{ base: 'column', lg: 'row' }} gap="40px" justify="space-between">
          {/* 왼쪽 영역 - 사이트 정보 */}
          <VStack align="start" gap="16px" flex="1">
            <Heading fontSize="28px" color="var(--main-color)" fontWeight="bold">
              README
            </Heading>
            <Text fontSize="14px" color="#666" lineHeight="1.6">
              당신의 독서 생활을 함께하는 도서 쇼핑몰
            </Text>
            <VStack align="start" gap="8px" fontSize="14px" color="#666">
              <Text>대표: 정원준</Text>
              <Text>사업자등록번호: 123-45-67890</Text>
              <Text>통신판매업신고: 2025-서울강남-12345</Text>
              <Text>주소: 서울특별시 강남구 테헤란로 123</Text>
              <Text>이메일: contact@readme.com</Text>
              <Text>고객센터: 1234-5678 (평일 09:00-18:00)</Text>
            </VStack>
          </VStack>

          {/* 중앙 영역 - 링크 */}
          <VStack align="start" gap="16px" flex="1">
            <Heading fontSize="18px" color="var(--main-color)" fontWeight="bold" mb="8px">
              고객지원
            </Heading>
            <VStack align="start" gap="12px">
              <Text 
                fontSize="14px" 
                color="#666" 
                cursor="pointer"
                _hover={{ color: "var(--main-color)", textDecoration: "underline" }}
              >
                이용약관
              </Text>
              <Text 
                fontSize="14px" 
                color="#666" 
                cursor="pointer"
                _hover={{ color: "var(--main-color)", textDecoration: "underline" }}
              >
                개인정보 처리방침
              </Text>
              <Text 
                fontSize="14px" 
                color="#666" 
                cursor="pointer"
                _hover={{ color: "var(--main-color)", textDecoration: "underline" }}
              >
                고객센터
              </Text>
            </VStack>
          </VStack>

          {/* 오른쪽 영역 - SNS & 팀원 */}
          <VStack align="start" gap="16px" flex="1">
            <Heading fontSize="18px" color="var(--main-color)" fontWeight="bold" mb="8px">
              Follow Us
            </Heading>
            <HStack gap="16px">
              <Box
                cursor="pointer"
                color="var(--sub-color)"
                _hover={{ color: "var(--main-color)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaInstagram size={24} />
              </Box>
              <Box
                cursor="pointer"
                color="var(--sub-color)"
                _hover={{ color: "var(--main-color)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaFacebook size={24} />
              </Box>
              <Box
                cursor="pointer"
                color="var(--sub-color)"
                _hover={{ color: "var(--main-color)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaTwitter size={24} />
              </Box>
              <Box
                cursor="pointer"
                color="var(--sub-color)"
                _hover={{ color: "var(--main-color)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaYoutube size={24} />
              </Box>
            </HStack>

            <VStack align="start" gap="8px" mt="16px">
              <Text fontSize="14px" color="var(--main-color)" fontWeight="bold">
                Team
              </Text>
              <Text fontSize="14px" color="#666">
                강두연 · 김근영 · 배예진 · 이주형
              </Text>
            </VStack>
          </VStack>
        </Flex>

        {/* 하단 저작권 */}
        <Box 
          borderTop="1px solid" 
          borderColor="gray.200" 
          mt="40px" 
          pt="24px"
          textAlign="center"
        >
          <Text fontSize="14px" color="#999">
            © 2025 README. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}