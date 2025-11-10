import { Box, VStack } from "@chakra-ui/react";
import { ADMIN_TAB } from "@/constants/adminMenu";

const SideBar = ({ tabIndex, handleClickTab }) => {
  return (
    <Box
      as="aside"
      w="240px"
      h="100%"
      bg="var(--main-color)"
      position="sticky"
      rounded="xl"
    >
      <VStack p="10px">
        {ADMIN_TAB.map((tab, idx) => (
          <Box
            key={tab.value}
            onClick={() => handleClickTab(idx)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="50px"
            color="#FFFFFF"
            fontWeight={tabIndex === idx ? "bold" : "normal"}
            bg={tabIndex === idx && "#FFFFFF50"}
            rounded="lg"
            _hover={{ cursor: "pointer" }}
          >
            {tab.label}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default SideBar;
