import { Box, Flex, Heading, Text, Avatar, Button, Link } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/layout";  // ✅ 중요: v3에서는 별도 import

const Profile = () => {
  return (
    <Box maxW="800px" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
      {/* 내 프로필 */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">내 프로필</Heading>
          <Button size="sm" colorScheme="blue" variant="outline">
            설정
          </Button>
        </Flex>

        <Divider mb={4} />

        <Flex align="center" gap={6}>
          <Avatar size="xl" />
          <Box>
            <Text><b>닉네임:</b> jhapoy106</Text>
            <Text>
              <b>프로필 주소:</b>{" "}
              <Link color="blue.500" href="https://inflearn.com/users/@jhapoy1068947" isExternal>
                inflearn.com/users/@jhapoy1068947
              </Link>
            </Text>
            <Text><b>자기소개:</b> 나만의 스킬, 깃허브 링크 등으로 소개글을 채워보세요.</Text>
          </Box>
        </Flex>
      </Box>

      {/* 기본 정보 */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">기본 정보</Heading>
        </Flex>

        <Divider mb={4} />

        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text><b>이메일:</b> jhapoy106@naver.com</Text>
            <Button size="sm" colorScheme="blue" variant="outline">설정</Button>
          </Flex>
          <Flex justify="space-between" align="center" mb={2}>
            <Text><b>비밀번호:</b> ******</Text>
            <Button size="sm" colorScheme="blue" variant="outline">설정</Button>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text><b>휴대폰 번호:</b> 휴대폰 번호를 인증해 주세요.</Text>
            <Button size="sm" colorScheme="blue" variant="outline">설정</Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
