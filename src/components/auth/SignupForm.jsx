import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react/field"; // ✅ v3에서 올바른 import 경로
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toaster } from "../ui/toaster";

const SignupForm = () => {
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toaster.create({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        type: "error",
      });
      return;
    }

    const isSuccess = await signup(name, email, password);
    if (isSuccess) {
      toaster.create({
        title: "회원가입 완료",
        description: "로그인 페이지로 이동합니다.",
        type: "success",
        duration: 1500,
      });
      setTimeout(() => navigate("/kt_3team_project_2025/login"), 1500);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      width="500px"
      height="400px"
      mx="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={6}
    >
      <VStack spacing={8} width="100%">
        {/* 이름 입력 */}
        <Field.Root required>
          <Field.Label fontWeight="semibold">이름</Field.Label>
          <Input
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          />
        </Field.Root>

        {/* 이메일 입력 */}
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

        {/* 비밀번호 입력 */}
        <Field.Root required>
          <Field.Label fontWeight="semibold">비밀번호</Field.Label>
          <Input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          />
        </Field.Root>

        {/* 비밀번호 확인 */}
        <Field.Root required>
          <Field.Label fontWeight="semibold">비밀번호 확인</Field.Label>
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="lg"
            borderRadius="md"
            boxShadow="sm"
            bg="white"
          />
        </Field.Root>

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          width="100%"
          height="45px"
          bg="#0A400C"
          color="white"
          isLoading={loading}
          loadingText="가입 중..."
          fontWeight="bold"
          _hover={{ bg: "#13661A" }}
        >
          회원가입
        </Button>

        {/* 에러 메시지 */}
        {error && (
          <Text color="red.500" fontSize="sm" mt={2} textAlign="center">
            {error}
          </Text>
        )}

        {/* 로그인 이동 */}
        <HStack>
          <Text fontSize="sm">이미 계정이 있으신가요?</Text>
          <Link
            color="#0A400C"
            onClick={() => navigate("/kt_3team_project_2025/login")}
          >
            로그인
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SignupForm;
