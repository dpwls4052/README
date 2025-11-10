import { Box, Container, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Box as="nav" py={3} top={0} zIndex={10} width="100%" margin="20px 0">
      <Container as="ul" maxW="1200px">
        <HStack as="li" spacing={8} justify="center" gap="120px">
          <Link
            as={Link}
            to="/kt_3team_project_2025/books/domestic"
            fontWeight="600"
            _hover={{ textDecoration: "none" }}
          >
            국내도서
          </Link>
          <Link
            as={Link}
            to="/kt_3team_project_2025/books/foreign"
            fontWeight="600"
            _hover={{ textDecoration: "none" }}
          >
            해외도서
          </Link>
          <Link
            as={Link}
            to="/kt_3team_project_2025/books/recommend"
            fontWeight="600"
            _hover={{ textDecoration: "none" }}
          >
            이달의 추천도서
          </Link>
          <Link
            as={Link}
            to="/kt_3team_project_2025/books/season"
            fontWeight="600"
            _hover={{ textDecoration: "none" }}
          >
            {" "}
            계절도서
          </Link>
        </HStack>
      </Container>
    </Box>
  );
};

export default Navigation;
