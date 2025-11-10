"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WidgetCheckoutPage } from "@/components/pay/WidgetCheckout";
import { useRouter, useSearchParams } from "next/navigation";

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 cartData 가져오기 → decodeURIComponent 후 JSON 파싱
  const cartDataString = searchParams.get("cartData");
  const cartData = cartDataString ? JSON.parse(decodeURIComponent(cartDataString)) : {};

  const [orderItems, setOrderItems] = useState(cartData.orderItems || []);
  const [cartTotalPrice, setCartTotalPrice] = useState(cartData.totalItemPrice || 0);
  const [cartDeliveryFee, setCartDeliveryFee] = useState(cartData.deliveryFee || 0);

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

  // 장바구니가 비어있으면 /cart로 이동
  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      router.push("/cart");
    }
  }, [orderItems, router]);

  // 스크롤 고정
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 다음 주소 API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress || data.jibunAddress);
        document.getElementById("detailAddress")?.focus();
      },
    }).open();
  };

  const totalItemPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartDeliveryFee;
  const remoteFee = isRemote ? 5000 : 0;
  const finalPrice = totalItemPrice + deliveryFee + remoteFee;

  const orderName =
    orderItems.length > 1
      ? `${orderItems[0].title} 외 ${orderItems.length - 1}건`
      : orderItems[0]?.title || "";

  const handlePaymentClick = () => {
    if (!agreed) return alert("구매 조건 및 결제 진행에 동의해주세요.");
    if (!widgetReady) return alert("결제 준비 중입니다. 잠시만 기다려주세요.");

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
    <div className="bg-[var(--bg-color)] min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-black">주문 / 결제</h1>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* 좌측 영역 */}
          <div className="flex-7 flex flex-col gap-6">
            {/* 주문 고객 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl mb-4 font-bold text-black">주문 고객</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-16 text-right">이름</span>
                  <input className="w-64 p-2 rounded-xl border border-gray-300" placeholder="이름" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-right">연락처</span>
                  <input
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={3}
                    className="w-16 p-2 rounded-xl border border-gray-300"
                  />
                  <span>-</span>
                  <input
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={4}
                    className="w-20 p-2 rounded-xl border border-gray-300"
                  />
                  <span>-</span>
                  <input
                    value={phone3}
                    onChange={(e) => setPhone3(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={4}
                    className="w-20 p-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-right">이메일</span>
                  <input className="w-64 p-2 rounded-xl border border-gray-300" placeholder="이메일" />
                </div>
              </div>
            </div>

            {/* 배송지 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl mb-4 font-bold text-black">배송지</h2>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setAddressType("existing")}
                  className={`px-4 py-2 rounded-lg ${addressType === "existing" ? "bg-[var(--main-color)] text-white" : "bg-white text-black border border-gray-300"}`}
                >
                  등록된 배송지
                </button>
                <button
                  onClick={() => setAddressType("new")}
                  className={`px-4 py-2 rounded-lg ${addressType === "new" ? "bg-[var(--main-color)] text-white" : "bg-white text-black border border-gray-300"}`}
                >
                  신규 입력
                </button>
              </div>

              {addressType === "new" && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input placeholder="우편번호" value={postcode} readOnly className="flex-1 p-2 rounded-xl border border-gray-300" />
                    <button onClick={handlePostcode} className="px-4 bg-[var(--main-color)] text-white rounded-xl">
                      주소찾기
                    </button>
                  </div>
                  <input placeholder="주소" value={address} readOnly className="p-2 rounded-xl border border-gray-300" />
                  <input
                    id="detailAddress"
                    placeholder="상세주소"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* 결제방법 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl mb-4 font-bold text-black">결제방법 선택</h2>
              <WidgetCheckoutPage
                amount={finalPrice}
                orderName={orderName}
                onReady={setWidgetReady}
                triggerPayment={triggerPayment}
              />
            </div>
          </div>

          {/* 우측 영역 */}
          <div className={`flex-3 ${isSticky ? "sticky top-5" : ""} h-fit flex flex-col gap-6`}>
            {/* 주문정보 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl mb-4 font-bold text-black">주문정보</h2>
              <div className="flex flex-col gap-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <Image src={item.image} width={80} height={80} className="rounded-lg object-cover" alt={item.title} />
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="font-bold text-black">{item.title}</span>
                      <span className="text-gray-600 text-sm">{item.quantity}권</span>
                      <span className="text-black">{item.price.toLocaleString()}원</span>
                      <span className="font-bold text-[var(--main-color)]">
                        총 {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 최종 결제금액 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl mb-4 font-bold text-black">최종 결제 금액</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>상품금액</span>
                  <span>{totalItemPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>{deliveryFee === 0 ? "무료" : `+${deliveryFee.toLocaleString()}원`}</span>
                </div>
                {isRemote && (
                  <div className="flex justify-between">
                    <span>도서산간</span>
                    <span>+{remoteFee.toLocaleString()}원</span>
                  </div>
                )}
                <div className="h-[1px] my-2 bg-[var(--sub-color)]" />
                <div className="flex justify-between font-bold text-xl text-black">
                  <span>최종 결제 금액</span>
                  <span className="text-[var(--main-color)]">{finalPrice.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 구매 조건 */}
            <div className="bg-gray-50 p-6 rounded-xl flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-base">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                구매 조건 및 결제 진행 동의
              </label>
              <div className="bg-white p-4 rounded-lg text-sm text-gray-600 flex flex-col gap-1">
                <span>• 전자상거래법 제8조에 따른 구매조건 확인</span>
                <span>• 개인정보 제3자 제공 동의</span>
                <span>• 전자금융거래 이용약관 동의</span>
              </div>
            </div>

            {/* 결제 버튼 */}
            <button
              onClick={handlePaymentClick}
              disabled={!agreed || !widgetReady}
              className={`w-full h-14 rounded-xl text-white text-xl font-bold ${agreed && widgetReady ? "bg-[var(--main-color)] hover:bg-[var(--sub-color)]" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {widgetReady ? "결제하기" : "결제 준비 중..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
