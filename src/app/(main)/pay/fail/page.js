import { useSearchParams, Link } from "react-router-dom";
import { Box, Button, Heading, Stack, Flex, Text } from "@chakra-ui/react";

export function PaymentFail() {
  const [searchParams] = useSearchParams();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <Box bg="white" minH="100vh" py="40px">
      <Box maxW="800px" mx="auto" px="20px">
        <Stack gap="32px" align="center">
          {/* 실패 이미지 및 타이틀 */}
          <Box
            bg="var(--bg-color)"
            p="40px"
            borderRadius="15px"
            w="100%"
            textAlign="center"
          >
            <Box fontSize="64px" mb="24px">
              ❌
            </Box>
            <Heading fontSize="28px" color="#C53030" mb="16px">
              결제에 실패했습니다
            </Heading>
            <Text fontSize="16px" color="#666">
              결제 처리 중 문제가 발생했습니다.
            </Text>
          </Box>

          {/* 에러 정보 */}
          <Box bg="var(--bg-color)" p="32px" borderRadius="15px" w="100%">
            <Heading fontSize="24px" mb="24px" color="#000">
              오류 정보
            </Heading>
            <Stack gap="16px">
              <Flex
                justify="space-between"
                py="12px"
                borderBottom="1px solid #e2e8f0"
              >
                <Text fontSize="16px" fontWeight="bold" color="#000">
                  에러 코드
                </Text>
                <Text fontSize="16px" color="#C53030" fontWeight="bold">
                  {errorCode || "알 수 없음"}
                </Text>
              </Flex>
              <Flex
                justify="space-between"
                py="12px"
                borderBottom="1px solid #e2e8f0"
              >
                <Text fontSize="16px" fontWeight="bold" color="#000">
                  에러 메시지
                </Text>
                <Text
                  fontSize="16px"
                  color="#666"
                  textAlign="right"
                  maxW="500px"
                >
                  {errorMessage || "알 수 없는 오류가 발생했습니다."}
                </Text>
              </Flex>
              {orderId && (
                <Flex justify="space-between" py="12px">
                  <Text fontSize="16px" fontWeight="bold" color="#000">
                    주문번호
                  </Text>
                  <Text fontSize="16px" color="#666">
                    {orderId}
                  </Text>
                </Flex>
              )}
            </Stack>
          </Box>

          {/* 안내 메시지 */}
          <Box bg="#FFF5F5" p="24px" borderRadius="15px" w="100%">
            <Text fontSize="16px" color="#666" mb="12px">
              💡 결제 실패 시 확인사항
            </Text>
            <Stack gap="8px" fontSize="14px" color="#666">
              <Text>• 카드 한도 또는 잔액을 확인해주세요</Text>
              <Text>• 카드 정보가 정확한지 확인해주세요</Text>
              <Text>• 결제 비밀번호를 다시 확인해주세요</Text>
              <Text>• 문제가 지속되면 카드사에 문의해주세요</Text>
            </Stack>
          </Box>

          {/* 버튼 영역 */}
          <Stack direction={{ base: "column", md: "row" }} gap="16px" w="100%">
            <Button
              as={Link}
              to="/kt_3team_project_2025/cart"
              bg="#0A400C"
              color="#FFFFFF"
              fontSize="18px"
              h="60px"
              borderRadius="15px"
              _hover={{ bg: "var(--main-color)" }}
              flex="1"
            >
              다시 결제하기
            </Button>
            <Button
              as={Link}
              to="/kt_3team_project_2025"
              bg="white"
              color="var(--main-color)"
              fontSize="18px"
              h="60px"
              borderRadius="15px"
              border="2px solid var(--main-color)"
              _hover={{ bg: "var(--bg-color)" }}
              flex="1"
            >
              홈으로 가기
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
