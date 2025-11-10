import {
  Box,
  Container,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { SlBasket } from "react-icons/sl";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import Logo from "../assets/logo.png";

export default function Header() {
  return (
    <Container borderBottom={"1px solid #eee"} p={4} position="sticky">
      <HStack justifyContent="space-between" alignItems="center">
        <Image
          src={Logo}
          // to="/kt_3team_project_2025"
          alt="사이트 로고"
          width="80px"
          objectFit="contain"
          cursor="pointer"
        />
        <Box>
          <InputGroup endElement={<IoIosSearch />}>
            <Input
              placeholder="검색어를 입력하세요."
              width="600px"
              height="50px"
              borderRadius="30px"
            />
          </InputGroup>
        </Box>
        <HStack>
          <IconButton
            variant="ghost"
            size="md"
            css={{
              _icon: {
                width: "6",
                height: "6",
              },
            }}
          >
            <Icon as={SlBasket} />
          </IconButton>
          <IconButton
            variant="ghost"
            size="md"
            css={{
              _icon: {
                width: "6",
                height: "6",
              },
            }}
          >
            <Icon as={IoIosHeartEmpty} />
          </IconButton>
        </HStack>
      </HStack>
    </Container>
  );
}
