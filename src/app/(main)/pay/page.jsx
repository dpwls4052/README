"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WidgetCheckoutPage from "@/components/pay/WidgetCheckout";
import AddressInput from "@/components/common/AddressInput";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/hooks/common/useAuth";

const Plus = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Minus = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function PaymentPage() {
  const router = useRouter();
  const { userId } = useAuth(); // 사용자 인증 정보

  // --- 주문 상품 및 가격 상태 (기존 유지) ---
  const [orderItems, setOrderItems] = useState([]);
  const [cartDeliveryFee, setCartDeliveryFee] = useState(0);
  const [isOrderInfoOpen, setIsOrderInfoOpen] = useState(true);

  // --- 주문자 정보 상태 ---
  const [userInfoType, setUserInfoType] = useState("existing");
  const [existingUserInfo, setExistingUserInfo] = useState(null);

  // 신규 입력 정보
  const [inputName, setInputName] = useState("");
  const [inputEmail, setEmail] = useState("");
  const [inputPhone1, setPhone1] = useState("010");
  const [inputPhone2, setPhone2] = useState("");
  const [inputPhone3, setPhone3] = useState("");
  const inputPhoneNumber = `${inputPhone1}${inputPhone2}${inputPhone3}`;

  // --- 배송지 정보 상태 ---
  const [addressType, setAddressType] = useState("existing");
  const [deliveryMemo, setDeliveryMemo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("toss");

  // 주소 관리 관련 상태
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // 신규 주소 입력 폼 상태
  const [newPostcode, setNewPostcode] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDetailAddress, setNewDetailAddress] = useState("");

  // --- 결제 및 UI 상태 (기존 유지) ---
  const [isSticky, setIsSticky] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [triggerPayment, setTriggerPayment] = useState(0);
  const simulatePayment = process.env.NEXT_PUBLIC_SIMULATE_PAYMENT === "true";

  // --- 주문 중복 방지 ---
  const [isProcessing, setIsProcessing] = useState(false); // ✅ 이 줄 추가
  // const simulatePayment = process.env.NEXT_PUBLIC_SIMULATE_PAYMENT === "true";

  // 1. 주문 상품 데이터 로드 (Local Storage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cartData");
      if (cartData) {
        const data = JSON.parse(cartData);
        // 수량이 0이거나 없는 아이템 제거
        const validItems = (data.orderItems || []).filter(
          (item) => item.quantity && item.quantity >= 1
        );

        // console.log("🔍 장바구니 데이터 구조:", validItems[0]);
        if (validItems.length === 0) {
          // alert("장바구니에 유효한 상품이 없습니다.");
          router.push("/cart");
          return;
        }

        setOrderItems(validItems);
        setCartDeliveryFee(data.deliveryFee || 0);
      } else {
        // alert("장바구니에 상품이 없습니다.");
        router.push("/cart");
      }
    }
  }, [router]);

  // 2. 사용자 정보 로드 (Profile 컴포넌트 참고)
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const idToken = await auth.currentUser.getIdToken();
      try {
        const res = await fetch("/api/user/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        });

        if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
        const data = await res.json();
        setExistingUserInfo(data.user);

        // 기존 정보 로드 시 신규 입력 폼에 기본값 설정
        setInputName(data.user.name || "");
        setEmail(data.user.email || "");
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, [userId]);

  // 3. 주소 목록 로드 및 기본 주소 설정 (Profile 컴포넌트 참고)
  const fetchAddressList = async () => {
    const idToken = await auth.currentUser.getIdToken();
    if (!userId) return;

    try {
      const res = await fetch("/api/user/address/getAddressList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        const addresses = data.addresses;
        setAddressList(addresses);

        const defaultAddr = addresses.find((addr) => addr.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.address_id);
          setAddressType("existing");
        } else if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].address_id);
          setAddressType("existing");
        } else {
          setAddressType("new"); // 주소 목록이 아예 없으면 신규 입력 강제
        }
      }
    } catch (err) {
      console.error("주소 목록 조회 실패:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddressList();
    }
  }, [userId]);

  // 4. Daum Postcode API 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 5. 스크롤 이벤트 (Sticky UI용)
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 6. 기존 사용자 정보 로드 시 전화번호 채우기 (Hooks 순서 오류 수정)
  useEffect(() => {
    if (existingUserInfo && userInfoType === "existing") {
      const phone = existingUserInfo.phone_number || "";
      setPhone1(phone.slice(0, 3) || "010");
      setPhone2(phone.slice(3, 7) || "");
      setPhone3(phone.slice(7, 11) || "");
    }
  }, [existingUserInfo, userInfoType]);

  // --- 데이터 파생 및 최종값 계산 ---
  const finalName =
    userInfoType === "existing" ? existingUserInfo?.name : inputName;
  const finalEmail =
    userInfoType === "existing" ? existingUserInfo?.email : inputEmail;
  const finalPhone =
    userInfoType === "existing"
      ? existingUserInfo?.phone_number
      : inputPhoneNumber;

  const selectedAddr =
    addressType === "existing"
      ? addressList.find((addr) => addr.address_id === selectedAddressId)
      : null;

  const finalAddress = selectedAddr
    ? {
        // 등록된 주소의 필드 이름을 API 응답 형식에 맞춰 매핑
        postcode: selectedAddr.postcode,
        address1: selectedAddr.address1 || selectedAddr.road_address, // address1 또는 road_address 사용
        address2: selectedAddr.address2 || selectedAddr.detail_address,
      }
    : {
        // 신규 주소는 현재 입력 필드 상태 사용
        postcode: newPostcode,
        address1: newAddress,
        address2: newDetailAddress,
      };

  const totalItemPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = totalItemPrice >= 30000 ? 0 : cartDeliveryFee;
  const finalPrice = totalItemPrice + deliveryFee;
  const orderName =
    orderItems.length > 1
      ? `${orderItems[0]?.title} 외 ${orderItems.length - 1}건`
      : orderItems[0]?.title || "";

  // --- 함수 정의 ---

  // 주소 검색 핸들러 (신규 입력용)
  const handlePostcodeSearchForNew = () => {
    if (!window.daum || !window.daum.Postcode) {
      // alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      console.error("Daum Postcode API not loaded.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setNewPostcode(data.zonecode);
        setNewAddress(data.roadAddress || data.jibunAddress);
        setTimeout(() => {
          document.getElementById("detailAddress")?.focus();
        }, 100);
      },
    }).open();
  };

  // 수량 변경 및 삭제
  const handleQuantityChange = (itemId, delta) => {
    setOrderItems((prev) => {
      const newItems = prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity < 1) {
            // alert("상품은 최소 1개 이상 주문해야 합니다.");
            return item; // 수량 변경을 막고 기존 아이템 반환
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return newItems;
    });
  };

  const handleRemoveItem = (itemId) => {
    if (orderItems.length === 1) {
      // alert("1개 이하의 상품은 주문할 수 없습니다.");
      return;
    }

    // confirm("이 상품을 주문에서 제외하시겠습니까?") 대신 커스텀 모달 사용 필요
    // 일단 임시로 confirm을 사용하지 않고 처리
    const remainingItems = orderItems.filter((item) => item.id !== itemId);

    // 상품이 1개 남아있는데 그걸 삭제하려고 할 때
    if (remainingItems.length === 0) {
      // alert("주문 상품이 없습니다.");
      router.push("/cart");
      return;
    }

    setOrderItems(remainingItems);
  };

  // 결제 클릭 핸들러 (유효성 검사 강화)
  // PaymentPage의 persistPendingOrder 함수 수정

  const persistPendingOrder = async () => {
    const currentUserId = userId;

    // console.log("💾 주문 데이터 저장 준비:", orderItems); // 디버깅용

    const orderPayload = {
      userId: currentUserId,
      orderItems: orderItems.map((item) => {
        // item의 실제 구조 확인을 위한 로그
        // console.log("📦 아이템 원본:", item);

        return {
          // item.id, item.book_id, item.bookId 등 여러 가능성 체크
          book_id: item.book_id || item.id || item.bookId,
          title: item.title,
          cover: item.image || item.cover,
          price: item.price,
          quantity: item.quantity,
        };
      }),
      price: finalPrice,
      name: finalName,
      phone: finalPhone,
      email: finalEmail,
      postal_code: finalAddress.postcode,
      address1: finalAddress.address1,
      address2: finalAddress.address2 || "",
      memo: deliveryMemo,
      paymentMethod,
      orderName,
    };

    // console.log("📮 최종 orderPayload:", JSON.stringify(orderPayload, null, 2));

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingOrderData", JSON.stringify(orderPayload));
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return orderPayload;
  };
  const handlePaymentClick = async () => {
    // ✅ 이미 처리 중이면 리턴
    if (isProcessing) {
      console.log("⚠️ 이미 결제 처리 중입니다.");
      return;
    }

    // 기존 유효성 검사들
    if (!agreed) {
      console.error("구매 조건 및 결제 진행에 동의해주세요.");
      return;
    }
    if (!widgetReady) {
      console.error("결제 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }
    if (orderItems.length === 0) {
      console.error("주문할 상품이 없습니다.");
      return;
    }

    // 주문자 정보 유효성 검사
    if (!finalName) {
      console.error("주문자 이름(필수)을 입력/확인해주세요.");
      return;
    }
    if (!finalEmail) {
      console.error("주문자 이메일(필수)을 입력/확인해주세요.");
      return;
    }

    if (!finalPhone || finalPhone.length < 10) {
      console.error("유효한 주문자 연락처(필수)를 입력/확인해주세요.");
      return;
    }

    // 배송지 정보 유효성 검사
    if (addressType === "existing") {
      if (!selectedAddressId || !finalAddress) {
        console.error("등록된 배송지 중 하나를 선택해주세요.");
        return;
      }
    } else if (addressType === "new") {
      if (!newPostcode) {
        console.error("새 배송지의 우편번호(필수)를 입력해주세요.");
        return;
      }
      if (!newAddress) {
        console.error("새 배송지의 주소(필수)를 입력해주세요.");
        return;
      }
    }

    if (!finalAddress?.postcode || !finalAddress?.address1) {
      console.error("유효한 배송지 정보를 선택/입력해주세요.");
      return;
    }

    // ✅ 처리 시작
    setIsProcessing(true);

    try {
      // 재고 검증
      const stockValidationRes = await fetch("/api/order/validateStock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItems: orderItems.map((item) => ({
            book_id: item.book_id || item.id || item.bookId,
            title: item.title,
            quantity: item.quantity,
          })),
        }),
      });

      const stockResult = await stockValidationRes.json();

      if (!stockResult.success) {
        const issueMessages = stockResult.stockIssues
          .map((issue) => `• ${issue.title}: ${issue.issue}`)
          .join("\n");

        alert(
          `재고가 부족합니다.\n\n${issueMessages}\n\n장바구니 페이지로 이동합니다.`
        );

        setIsProcessing(false); // ✅ 처리 중단
        router.push("/cart");
        return;
      }

      console.log("✅ 재고 검증 완료");

      await persistPendingOrder();

      if (simulatePayment) {
        router.push("/pay/success");
        return; // ✅ 페이지 이동하면 자동으로 처리 종료
      }

      setTriggerPayment((prev) => prev + 1);
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsProcessing(false); // ✅ 에러 발생 시 다시 활성화
    }
  };
  // ----------------------------------------------------
  // Hooks 호출 완료 후 조건부 리턴 (로딩 상태)
  // ----------------------------------------------------
  if (!userId || (userInfoType === "existing" && !existingUserInfo)) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="px-5 mx-auto max-w-1200 pt-50">
          <h1 className="mb-20 text-3xl font-bold">주문 / 결제</h1>
        </div>
        <div className="flex flex-col gap-20 px-5 py-8 mx-auto max-w-1200 lg:flex-row">
          {/* 좌측 */}
          <div className="flex-[2] flex flex-col gap-5">
            {/* 주문 상품 */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div
                className="bg-[var(--bg-color)] p-4 cursor-pointer flex justify-between items-center"
                onClick={() => setIsOrderInfoOpen(!isOrderInfoOpen)}
              >
                <div className="flex items-center gap-10 p-10">
                  <FiPackage className="text-[var(--main-color)]" size={20} />
                  <h2 className="font-bold text-18">주문 상품</h2>
                  <span className="bg-[var(--sub-color)] text-white font-medium px-12 py-6 rounded-sm">
                    {orderItems.length}개
                  </span>
                </div>
                <div className="text-[var(--main-color)] mr-10">
                  {isOrderInfoOpen ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </div>
              </div>
              {isOrderInfoOpen && (
                <div className="p-5 space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={
                        item.book_id ||
                        item.id ||
                        item.bookId ||
                        `item-${index}`
                      }
                      className="flex items-center justify-between px-10 border-b border-gray-200 py-15 gap-15"
                    >
                      <div className="flex items-start flex-1 gap-20">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-cover rounded-lg w-100 h-140"
                        />
                        <div className="flex flex-col flex-1 gap-1">
                          <p className="mt-5 text-base font-medium text-black">
                            {item.title}* {item.quantity}권
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                         
                          <button onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity <= 1} className="p-2 bg-[var(--sub-color)] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:cursor-pointer"><Minus /></button>
                          <span className="font-medium min-w-[40px] text-center text-black">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.id, 1)} className="p-2 bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90  hover:cursor-pointer"><Plus /></button>
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-lg font-bold text-black">{(item.price * item.quantity).toLocaleString()}원</p>
                        </div>
                
                        <button onClick={() => handleRemoveItem(item.id)} disabled={orderItems.length <= 1} className="p-2 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-30" title="삭제"><FiX size={20} /></button>
                      </div> */}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 주문자 정보 */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                <div className="flex items-center gap-10 p-10">
                  <FiUser className="text-[var(--main-color)]" size={20} />
                  <h2 className="font-bold text-black text-18">
                    주문 고객 정보 (필수)
                  </h2>
                </div>
              </div>
              <div className="p-15">
                {/* 기존 정보/신규 입력 선택 */}
                <div className="flex gap-4 mb-10">
                  <button
                    onClick={() => setUserInfoType("existing")}
                    disabled={!existingUserInfo}
                    className={`flex-1 px-4 py-12 rounded-sm font-medium transition-all text-sm disabled:opacity-60 ${
                      userInfoType === "existing"
                        ? "bg-[var(--main-color)] text-white"
                        : "bg-[var(--bg-color)] text-black hover:bg-gray-200 hover:cursor-pointer"
                    }`}
                  >
                    기존 회원 정보
                  </button>
                  <button
                    onClick={() => setUserInfoType("new")}
                    className={`flex-1 px-4 py-12 rounded-sm font-medium transition-all text-sm ${
                      userInfoType === "new"
                        ? "bg-[var(--main-color)] text-white"
                        : "bg-[var(--bg-color)] text-black hover:bg-gray-200 hover:cursor-pointer"
                    }`}
                  >
                    신규 입력
                  </button>
                </div>

                {/* 입력 폼 */}
                {userInfoType === "existing" && existingUserInfo ? (
                  <div className="p-4 space-y-2 rounded-md bg-gray-50">
                    <p className="text-lg text-black">
                      <span className="mr-2 font-semibold">이름:</span>{" "}
                      {existingUserInfo.name}
                    </p>
                    <p className="text-lg text-black">
                      <span className="mr-2 font-semibold">이메일:</span>{" "}
                      {existingUserInfo.email}
                    </p>
                    <p className="text-lg text-black">
                      <span className="mr-2 font-semibold">연락처:</span>{" "}
                      {existingUserInfo.phone_number ||
                        "미등록 (정보 수정 필요)"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-8">
                      <label className="mb-2 font-medium text-black text-16">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full px-10 py-8 rounded-sm border border-gray-300 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                        placeholder="이름을 입력하세요 (필수)"
                      />
                    </div>
                    <div className="flex flex-col gap-8">
                      <label className="mb-5 font-medium text-black text-16 ">
                        연락처 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          value={inputPhone1}
                          onChange={(e) =>
                            setPhone1(e.target.value.replace(/[^0-9]/g, ""))
                          }
                          maxLength={3}
                          className="flex-1 px-3 py-8 text-center bg-white rounded-sm border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          value={inputPhone2}
                          onChange={(e) =>
                            setPhone2(e.target.value.replace(/[^0-9]/g, ""))
                          }
                          maxLength={4}
                          className="flex-1 px-3 py-8 text-center bg-white rounded-sm border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          value={inputPhone3}
                          onChange={(e) =>
                            setPhone3(e.target.value.replace(/[^0-9]/g, ""))
                          }
                          maxLength={4}
                          className="flex-1 px-3 py-8 text-center bg-white rounded-sm border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-8">
                      <label className="mb-2 font-medium text-black text-16 ">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={inputEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com (필수)"
                        className="w-full px-10 py-8 bg-white rounded-sm border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 배송지 */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                <div className="flex items-center gap-10 p-10">
                  <FiMapPin className="text-[var(--main-color)]" size={20} />
                  <h2 className="font-bold text-black text-18">
                    배송지 선택 (필수)
                  </h2>
                </div>
              </div>
              <div className="p-15">
                <div className="flex gap-4 mb-5">
                  <button
                    onClick={() => setAddressType("existing")}
                    disabled={addressList.length === 0}
                    className={`flex-1 px-4 py-12 rounded-sm font-medium transition-all text-sm disabled:opacity-60 ${
                      addressType === "existing"
                        ? "bg-[var(--main-color)] text-white"
                        : "bg-[var(--bg-color)] text-black hover:bg-gray-200 hover:cursor-pointer"
                    }`}
                  >
                    등록된 배송지 목록 ({addressList.length}개)
                  </button>
                  <button
                    onClick={() => setAddressType("new")}
                    className={`flex-1 px-4 py-12 rounded-sm font-medium transition-all text-sm ${
                      addressType === "new"
                        ? "bg-[var(--main-color)] text-white"
                        : "bg-[var(--bg-color)] text-black hover:bg-gray-200 hover:cursor-pointer"
                    }`}
                  >
                    신규 입력
                  </button>
                </div>

                {/* 등록된 주소 목록 선택 */}
                {addressType === "existing" && addressList.length > 0 && (
                  <div className="space-y-10 p-3 max-h-[250px] overflow-y-auto">
                    {addressList.map((addr) => (
                      <div
                        key={addr.address_id}
                        className={`p-10 border rounded-sm cursor-pointer transition-all ${
                          selectedAddressId === addr.address_id
                            ? "border-[var(--main-color)] bg-green-50 ring-2 ring-[var(--main-color)]"
                            : "border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedAddressId(addr.address_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-black">
                              {addr.nickname}
                            </span>
                            {addr.is_default && (
                              <span className="px-6 py-3 ml-4 text-xs bg-[var(--sub-color)] text-white rounded-sm">
                                기본
                              </span>
                            )}
                          </div>
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === addr.address_id}
                            onChange={() =>
                              setSelectedAddressId(addr.address_id)
                            }
                            className="w-4 h-4 text-[var(--main-color)] border-gray-300 focus:ring-[var(--main-color)]"
                          />
                        </div>
                        <p className="mt-5 text-sm font-normal text-gray-600">
                          [{addr.postcode}] {addr.road_address}{" "}
                          {addr.detail_address}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 신규 주소 입력 */}
                {addressType === "new" && (
                  <>
                    <div className="mb-2 text-sm text-red-500">
                      주소와 우편번호는 필수 입력 항목입니다.
                    </div>
                    <AddressInput
                      postcode={newPostcode}
                      address={newAddress}
                      detailAddress={newDetailAddress}
                      onDetailAddressChange={setNewDetailAddress}
                      onPostcodeSearch={handlePostcodeSearchForNew}
                    />
                  </>
                )}

                {/* 주소 목록이 없고 신규 입력도 아닐 경우 안내 */}
                {addressType === "existing" && addressList.length === 0 && (
                  <div className="p-4 text-center text-gray-500 border rounded-md bg-gray-50">
                    등록된 배송지가 없습니다. '신규 입력'을 선택해주세요.
                  </div>
                )}

                <div className="mt-15">
                  <label className="block mb-10 font-medium text-black text-16">
                    배송메모 (선택)
                  </label>
                  <textarea
                    value={deliveryMemo}
                    onChange={(e) => setDeliveryMemo(e.target.value)}
                    placeholder="배송 시 요청사항을 입력하세요 (예: 경비실에 맡겨주세요)"
                    className="w-full px-10 py-8 rounded-sm border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 결제 위젯 */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                <div className="flex items-center gap-10 p-10">
                  <FiCreditCard
                    className="text-[var(--main-color)]"
                    size={20}
                  />
                  <h2 className="font-bold text-black text-18">
                    결제방법 선택
                  </h2>
                </div>
              </div>
              <div className="p-5">
                <WidgetCheckoutPage
                  amount={finalPrice}
                  orderName={orderName}
                  onReady={setWidgetReady}
                  triggerPayment={triggerPayment}
                />
              </div>
            </div>
          </div>

          {/* 우측 요약 */}
          <div
            className={`${
              isSticky ? "sticky top-100" : "relative"
            } flex-[1] h-fit space-y-5`}
          >
            <div className="bg-[var(--bg-color)] p-20 rounded-md shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-black mb-30">
                  주문 정보
                </h2>
                <div className="flex items-center gap-10 mb-30">
                  <FiTruck className="text-[var(--main-color)]" size={18} />
                  <h3 className="font-bold text-black text-18">배송 정보</h3>
                </div>
                <div className="flex flex-col mb-4 gap-25">
                  <div className="flex justify-between text-black">
                    <span className="font-normal text-gray-600">배송 방법</span>
                    <span className="font-medium">일반배송</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span className="font-normal text-gray-600">도착 예정</span>
                    <span className="font-medium text-[var(--main-color)]">
                      {/* {new Date().toLocaleDateString()} */}
                      주문 후 영업일 2~3일 이내 배송 예정
                    </span>
                  </div>
                </div>
                <hr className="my-10 border-gray-200" />
                <div className="flex justify-between mb-2 text-black">
                  <span className="font-normal text-gray-600">
                    총 상품 금액
                  </span>
                  <span className="font-bold">
                    {totalItemPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-black">
                  <span className="font-normal text-gray-600">배송비</span>
                  <span className="font-bold">
                    {deliveryFee.toLocaleString()}원
                  </span>
                </div>
                <hr className="my-10 border-gray-200" />
                <div className="flex justify-between mb-10 text-black">
                  <span className="text-lg font-bold">총 결제 금액</span>
                  <span className="font-bold text-lg text-[var(--main-color)]">
                    {finalPrice.toLocaleString()}원
                  </span>
                </div>
                {/* 동의 체크박스 */}
                <div className="flex items-center gap-2 mb-10">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-20 h-20 mr-10"
                  />
                  <label htmlFor="agreed" className="text-sm text-black">
                    구매 조건 및 결제 진행에 동의합니다.
                  </label>
                </div>

                <div className="mt-20">
                  {/* <button onClick={handlePaymentClick} className="w-full py-15 bg-[var(--main-color)] rounded-md text-white text-lg font-bold hover:opacity-90 transition-opacity">결제 진행</button> */}
                  <button
                    onClick={handlePaymentClick}
                    disabled={isProcessing}
                    className={`w-full py-15 rounded-md text-white text-lg font-bold transition-all ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[var(--main-color)] hover:opacity-90 cursor-pointer"
                    }`}
                  >
                    {isProcessing ? "처리 중..." : "결제 진행"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
