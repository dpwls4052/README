import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  HStack,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { WidgetCheckoutPage } from "@/components/pay/WidgetCheckout";
import { useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart에서 전달받은 데이터
  const cartData = location.state || {};
  const [orderItems, setOrderItems] = useState(cartData.orderItems || []);
  const [cartTotalPrice, setCartTotalPrice] = useState(
    cartData.totalItemPrice || 0
  );
  const [cartDeliveryFee, setCartDeliveryFee] = useState(
    cartData.deliveryFee || 0
  );

  const [customerType, setCustomerType] = useState("existing");
  const [addressType, setAddressType] = useState("existing");
  const [deliveryRequest, setDeliveryRequest] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [triggerPayment, setTriggerPayment] = useState(0);
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const phoneNumber = `${phone1}${phone2}${phone3}`;

  // 장바구니가 비어있으면 장바구니로 리다이렉트
  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      navigate("/kt_3team_project_2025/cart");
    }
  }, [orderItems, navigate]);

  // 스크롤 고정
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 다음 주소 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 주소 검색 함수
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress || data.jibunAddress);
        document.getElementById("detailAddress")?.focus();
      },
    }).open();
  };

  const totalItemPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartDeliveryFee;
  const remoteFee = isRemote ? 5000 : 0;
  const finalPrice = totalItemPrice + deliveryFee + remoteFee;

  const orderName =
    orderItems.length > 1
      ? `${orderItems[0].title} 외 ${orderItems.length - 1}건`
      : orderItems[0]?.title || "";

  const handlePaymentClick = () => {
    if (!agreed) {
      alert("구매 조건 및 결제 진행에 동의해주세요.");
      console.log("test");
      return;
    }
    if (!widgetReady) {
      alert("결제 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }

    const paymentData = {
      phoneNumber,
      orderName,
      finalPrice,
      orderItems,
      address: `${address} ${detailAddress}`,
      postcode,
    };

    localStorage.setItem("paymentData", JSON.stringify(paymentData));
    setTriggerPayment((prev) => prev + 1);
  };

  return (
    <Box bg="white" minH="100vh" py="40px">
      <Box maxW="1200px" mx="auto" px="20px">
        <Heading fontSize="32px" mb="32px" color="#000">
          주문 / 결제
        </Heading>

        <Flex gap="20px" direction={{ base: "column", lg: "row" }}>
          <Stack flex="7" gap="25px">
            {/* 주문 고객 */}
            <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
              <Heading fontSize="24px" mb="16px" color="#000">
                주문 고객
              </Heading>
              <Stack gap="16px">
                <Flex align="center" mb="10px">
                  <Text minW="60px" textAlign="right" mr="10px">
                    이름
                  </Text>
                  <Input
                    placeholder="이름"
                    bg="white"
                    fontSize="16px"
                    borderRadius="15px"
                    w="250px"
                  />
                </Flex>

                <Flex align="center" mb="10px">
                  <Text minW="60px" textAlign="right" mr="10px">
                    연락처
                  </Text>
                  <HStack gap="8px">
                    <Input
                      value={phone1}
                      onChange={(e) =>
                        setPhone1(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      maxLength="3"
                      w="60px"
                    />
                    <Text>-</Text>
                    <Input
                      value={phone2}
                      onChange={(e) =>
                        setPhone2(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      maxLength="4"
                      w="70px"
                    />
                    <Text>-</Text>
                    <Input
                      value={phone3}
                      onChange={(e) =>
                        setPhone3(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      maxLength="4"
                      w="70px"
                    />
                  </HStack>
                </Flex>

                <Flex align="center">
                  <Text minW="60px" textAlign="right" mr="10px">
                    이메일
                  </Text>
                  <Input
                    placeholder="이메일"
                    bg="white"
                    fontSize="16px"
                    borderRadius="15px"
                    w="250px"
                  />
                </Flex>
              </Stack>
            </Box>

            {/* 배송지 */}
            <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
              <Heading fontSize="24px" mb="16px" color="#000">
                배송지
              </Heading>

              <HStack gap="24px" mb="16px">
                <Button
                  onClick={() => setAddressType("existing")}
                  bg={
                    addressType === "existing" ? "var(--main-color)" : "white"
                  }
                  color={addressType === "existing" ? "#fff" : "#000"}
                >
                  등록된 배송지
                </Button>
                <Button
                  onClick={() => setAddressType("new")}
                  bg={addressType === "new" ? "var(--main-color)" : "white"}
                  color={addressType === "new" ? "#fff" : "#000"}
                >
                  신규 입력
                </Button>
              </HStack>

              {/* 배송지 - 주소찾기 api  */}
              {addressType === "new" && (
                <Stack gap="12px">
                  <HStack>
                    <Input placeholder="우편번호" value={postcode} readOnly />
                    <Button
                      onClick={handlePostcode}
                      bg="var(--main-color)"
                      color="white"
                    >
                      주소찾기
                    </Button>
                  </HStack>
                  <Input placeholder="주소" value={address} readOnly />
                  <Input
                    id="detailAddress"
                    placeholder="상세주소"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                  />

                  {/* 추후에 도서산간 지역 배송비 별도로 할 시 주석 해제 필요 */}

                  {/* <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <input type="checkbox" onChange={(e) => setIsRemote(e.target.checked)} style={{ width: '18px', height: '18px' }}/>
                    도서산간 지역
                  </label> */}
                </Stack>
              )}
            </Box>

            {/* 결제방법 선택 */}
            <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
              <Heading fontSize="24px" mb="16px" color="#000">
                결제방법 선택
              </Heading>
              <WidgetCheckoutPage
                amount={finalPrice}
                orderName={orderName}
                onReady={setWidgetReady}
                triggerPayment={triggerPayment}
              />
            </Box>
          </Stack>

          {/* 우측 영역 (30%) */}
          <Box
            flex="3"
            position={isSticky ? "sticky" : "relative"}
            top={isSticky ? "20px" : "0"}
            h="fit-content"
          >
            <Stack gap="25px">
              {/* 주문정보 */}
              <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
                <Heading fontSize="24px" mb="16px" color="#000">
                  {" "}
                  주문정보{" "}
                </Heading>
                <Stack gap="16px">
                  {orderItems.map((item) => (
                    <HStack key={item.id} gap="16px" align="start">
                      <Image
                        src={item.image}
                        boxSize="80px"
                        borderRadius="10px"
                        objectFit="cover"
                      />
                      <Stack gap="4px" flex="1">
                        <Text fontSize="16px" fontWeight="bold" color="#000">
                          {item.title}
                        </Text>
                        <Text fontSize="14px" color="#666">
                          {item.quantity}권
                        </Text>
                        <Text fontSize="16px" color="#000">
                          {item.price.toLocaleString()}원
                        </Text>
                        <Text
                          fontSize="16px"
                          fontWeight="bold"
                          color="var(--main-color)"
                        >
                          총 {(item.price * item.quantity).toLocaleString()}원
                        </Text>
                      </Stack>
                    </HStack>
                  ))}
                </Stack>
              </Box>

              {/* 최종 결제 금액 */}
              <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
                <Heading fontSize="24px" mb="16px" color="#000">
                  {" "}
                  최종 결제 금액{" "}
                </Heading>
                <Stack gap="12px">
                  <Flex justify="space-between">
                    <Text fontSize="16px" color="#000">
                      상품금액
                    </Text>
                    <Text fontSize="16px" color="#000">
                      {totalItemPrice.toLocaleString()}원
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="16px" color="#000">
                      배송비
                    </Text>
                    <Text fontSize="16px" color="#000">
                      {deliveryFee === 0
                        ? "무료"
                        : `+${deliveryFee.toLocaleString()}원`}
                    </Text>
                  </Flex>
                  {isRemote && (
                    <Flex justify="space-between">
                      <Text fontSize="16px" color="#000">
                        도서산간
                      </Text>
                      <Text fontSize="16px" color="#000">
                        +{remoteFee.toLocaleString()}원
                      </Text>
                    </Flex>
                  )}
                  <Box h="1px" bg="var(--sub-color)" my="8px" />
                  <Flex justify="space-between">
                    <Text fontSize="24px" fontWeight="bold" color="#000">
                      {" "}
                      최종 결제 금액{" "}
                    </Text>
                    <Text
                      fontSize="24px"
                      fontWeight="bold"
                      color="var(--main-color)"
                    >
                      {finalPrice.toLocaleString()}원
                    </Text>
                  </Flex>
                </Stack>
              </Box>

              {/* 구매 조건 및 결제 진행 동의 */}
              <Box bg="var(--bg-color)" p="24px" borderRadius="15px">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "16px",
                    marginBottom: "16px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ width: "18px", height: "18px" }}
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  구매 조건 및 결제 진행 동의
                </label>
                <Box
                  bg="white"
                  p="16px"
                  borderRadius="10px"
                  fontSize="14px"
                  color="#666"
                >
                  <Text>• 전자상거래법 제8조에 따른 구매조건 확인</Text>
                  <Text>• 개인정보 제3자 제공 동의</Text>
                  <Text>• 전자금융거래 이용약관 동의</Text>
                </Box>
              </Box>

              {/* 결제하기 버튼 */}
              <Button
                bg={agreed && widgetReady ? "var(--main-color)" : "#ccc"}
                color="#fff"
                fontSize="24px"
                h="60px"
                borderRadius="15px"
                _hover={{
                  bg: agreed && widgetReady ? "var(--sub-color)" : "#ccc",
                }}
                onClick={handlePaymentClick}
                isDisabled={!agreed || !widgetReady}
                cursor={agreed && widgetReady ? "pointer" : "not-allowed"}
              >
                {widgetReady ? "결제하기" : "결제 준비 중..."}
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
