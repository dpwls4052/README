import { Container } from "@chakra-ui/react";
import Navigation from "@/components/main/Navigation";
import Banner from "@/components/main/Banner";
import Bestseller from "@/components/main/Bestseller";
import Recommend from "@/components/main/Recommend";

// 메인 페이지
const Main = () => {
  return (
    <Container
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="fit-content"
    >
      <Navigation />
      <Banner />
      <Bestseller />
      <Recommend />
    </Container>
  );
};

export default Main;
