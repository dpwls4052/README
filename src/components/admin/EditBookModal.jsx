import { useState } from "react";
import {
  Button,
  Dialog,
  VStack,
  HStack,
  Image,
  Text,
  Portal,
  NumberInput,
} from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import ButtonWithIcon from "@/components/ButtonWithIcon";

const EditBookModal = ({ book, handleUpdateBook, handleDeleteBook }) => {
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(book.stock);

  const handleSave = () => {
    handleUpdateBook(book.id, { stock: Number(stock) });
    setOpen(false);
  };
  const handleDelete = () => {
    handleDeleteBook(book.id);
  };

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (e.open === false) {
          setStock(book.stock);
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button bg="var(--sub-color)">편집</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="20px" gap="10px">
            <Dialog.Header p="0px">책 정보 편집</Dialog.Header>
            <Dialog.Body p="0px">
              <HStack gap="10px" align="start" h="160px">
                {/* 왼쪽 이미지 */}
                <Image
                  src={book.cover}
                  alt={book.title}
                  borderRadius="md"
                  w="100px"
                  h="100%"
                />

                {/* 오른쪽 책 정보 */}
                <VStack flex="1" h="100%" justify="space-between">
                  <VStack align="start" gap="5px">
                    <Text fontSize="20px" lineHeight="1.2">
                      {book.title}
                    </Text>
                    <Text>{book.author}</Text>
                    <Text fontSize="18px">{book.priceStandard}원</Text>
                  </VStack>

                  {/* 재고 수량 조절 */}
                  <NumberInput.Root
                    unstyled
                    spinOnPress={false}
                    value={stock}
                    onValueChange={(details) => setStock(details.value)}
                    w="100%"
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                    gap="10px"
                    min="0"
                  >
                    재고
                    <HStack
                      gap="0px"
                      h="30px"
                      border="1px solid #cccccc"
                      borderRadius="md"
                    >
                      <NumberInput.DecrementTrigger asChild>
                        <ButtonWithIcon
                          btnWidth="28px"
                          btnHeight="28px"
                          icon={FaMinus}
                          iconWidth="10px"
                          iconHeight="10px"
                          variant="ghost"
                        />
                      </NumberInput.DecrementTrigger>
                      <NumberInput.Input
                        textAlign="center"
                        w="100px"
                        h="100%"
                        outline="none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSave();
                          }
                        }}
                      />
                      <NumberInput.IncrementTrigger asChild>
                        <ButtonWithIcon
                          btnWidth="28px"
                          btnHeight="28px"
                          icon={FaPlus}
                          iconWidth="10px"
                          iconHeight="10px"
                          variant="ghost"
                        />
                      </NumberInput.IncrementTrigger>
                    </HStack>
                  </NumberInput.Root>
                </VStack>
              </HStack>
            </Dialog.Body>

            {/* 편집 완료 버튼 */}
            <Dialog.Footer p="0px">
              <HStack>
                <Button
                  bg="white"
                  border="1px solid var(--main-color)"
                  color="var(--main-color)"
                  onClick={handleDelete}
                >
                  삭제
                </Button>
                <Button bg="var(--main-color)" onClick={handleSave}>
                  저장
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditBookModal;
