import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import LoginForm from "../components/auth/LoginForm";
import logo from "../assets/logo.png";

const Login = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="100vw"
      height="100vh"
      bg={"#FEFAE0"}
    >
      <Image
        src={logo}
        alt="README Logo"
        width="250px"
        mb="32px"
        objectFit="contain"
      />

      <Box p="48px 64px" borderRadius="12px" boxShadow="md" bg="white">
        <LoginForm />
      </Box>
    </Flex>
  );
};

export default Login;
