import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react/field"; // ✅ 올바른 import 위치
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toaster } from "../ui/toaster";

const LoginForm = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await login(email, password);
    if (isSuccess) {
      toaster.create({
        title: "로그인 성공",
        description: "환영합니다!",
        type: "success",
        duration: 2000,
      });
      navigate("/kt_3team_project_2025");
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      width="500px"
      height="300px"
      mx="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={6}
    >
      <VStack spacing={6} width="100%">
        {/* 이메일 */}
        <Field.Root required>
          <Field.Label fontWeight="semibold">이메일</Field.Label>
          <Input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          />
        </Field.Root>

        {/* 비밀번호 */}
        <Field.Root required>
          <Field.Label fontWeight="semibold">비밀번호</Field.Label>
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          />
        </Field.Root>

        {/* 링크 */}
        <HStack justify="space-between" width="100%">
          <Link fontSize="sm" color="#0A400C" href="#">
            아이디 찾기
          </Link>
          <Link fontSize="sm" color="#0A400C" href="#">
            비밀번호 찾기
          </Link>
          <Link
            as={RouterLink}
            to="/kt_3team_project_2025/signup"
            fontSize="sm"
            color="#0A400C"
          >
            회원가입
          </Link>
        </HStack>

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          width="100%"
          height="45px"
          bg="#0A400C"
          color="white"
          fontWeight="bold"
          isLoading={loading}
          loadingText="로그인 중..."
          _hover={{ bg: "#13661A" }}
        >
          로그인
        </Button>

        {error && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default LoginForm;
