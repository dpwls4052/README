import React from "react";
import { Box, Image } from "@chakra-ui/react";
import SignupForm from "../components/auth/SignupForm";
import logo from "../assets/logo.png";

const SignupPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bg="#FFFAE5" // ✅ 페이지 전체 배경색 (연한 베이지톤)
    >
      {/* 로고 */}
      <Image
        src={logo}
        alt="README Logo"
        width="250px"
        mb="32px"
        objectFit="contain"
      />

      {/* 회원가입 폼을 감싸는 카드 박스 */}
      <Box
        bg="white"
        p="48px 64px"
        borderRadius="lg"
        boxShadow="md"
        maxWidth="90%"
      >
        <SignupForm />
      </Box>
    </Box>
  );
};

export default SignupPage;
