"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WidgetCheckoutPage from './../../../components/pay/WidgetCheckout'; // 경로를 실제 파일 위치에 맞게 수정하세요

export default function PaymentPage() {
  const router = useRouter();
  
  const [orderItems, setOrderItems] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [cartDeliveryFee, setCartDeliveryFee] = useState(0);

  const [addressType, setAddressType] = useState('existing');
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [triggerPayment, setTriggerPayment] = useState(0);
  const [phone1, setPhone1] = useState('010');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');

  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const phoneNumber = `${phone1}${phone2}${phone3}`;

  // Cart에서 전달받은 데이터 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cartData');
      if (cartData) {
        const data = JSON.parse(cartData);
        setOrderItems(data.orderItems || []);
        setCartTotalPrice(data.totalItemPrice || 0);
        setCartDeliveryFee(data.deliveryFee || 0);
      } else {
        alert('장바구니에 상품이 없습니다.');
        router.push('/cart');
      }
    }
  }, [router]);

  // 장바구니가 비어있으면 장바구니로 리다이렉트
  useEffect(() => {
    if (orderItems.length === 0 && typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cartData');
      if (!cartData) {
        alert('장바구니에 상품이 없습니다.');
        router.push('/cart');
      }
    }
  }, [orderItems, router]);

  // 스크롤 고정
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 다음 주소 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 주소 검색 함수
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress || data.jibunAddress);
        document.getElementById("detailAddress")?.focus();
      }
    }).open();
  };

  const totalItemPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartDeliveryFee;
  const remoteFee = isRemote ? 5000 : 0;
  const finalPrice = totalItemPrice + deliveryFee + remoteFee;

  const orderName = orderItems.length > 1 
    ? `${orderItems[0]?.title} 외 ${orderItems.length - 1}건`
    : orderItems[0]?.title || '';

  const handlePaymentClick = () => {
    if (!agreed) {
      alert('구매 조건 및 결제 진행에 동의해주세요.');
      return;
    }
    if (!widgetReady) {
      alert('결제 준비 중입니다. 잠시만 기다려주세요.');
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
    setTriggerPayment(prev => prev + 1);
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-5">
        <h1 className="text-[32px] font-bold mb-8 text-black">
          주문 / 결제
        </h1>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-[7] flex flex-col gap-6">
            {/* 주문 고객 */}
            <div className="bg-[var(--bg-color)] p-6 rounded-[15px]">
              <h2 className="text-[24px] font-bold mb-4 text-black">
                주문 고객
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center mb-2">
                  <span className="min-w-[60px] text-right mr-2 text-black">
                    이름 
                  </span>
                  <input
                    placeholder="이름"
                    className="bg-white px-4 py-2 text-[16px] rounded-[15px] w-64 border border-gray-200 focus:outline-none focus:border-[var(--main-color)]"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <span className="min-w-[60px] text-right mr-2 text-black">
                    연락처  
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={3}
                      className="w-[60px] px-2 py-2 text-center border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--main-color)]"
                    />
                    <span className="text-black">-</span>
                    <input
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={4}
                      className="w-[70px] px-2 py-2 text-center border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--main-color)]"
                    />
                    <span className="text-black">-</span>
                    <input
                      value={phone3}
                      onChange={(e) => setPhone3(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={4}
                      className="w-[70px] px-2 py-2 text-center border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--main-color)]"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="min-w-[60px] text-right mr-2 text-black">
                    이메일 
                  </span>
                  <input
                    placeholder="이메일"
                    className="bg-white px-4 py-2 text-[16px] rounded-[15px] w-64 border border-gray-200 focus:outline-none focus:border-[var(--main-color)]"
                  />
                </div>
              </div>
            </div>

            {/* 배송지 */}
            <div className="bg-[var(--bg-color)] p-6 rounded-[15px]">
              <h2 className="text-[24px] font-bold mb-4 text-black">
                배송지
              </h2>

              <div className="flex gap-6 mb-4">
                <button 
                  onClick={() => setAddressType('existing')} 
                  className={`px-4 py-2 rounded-lg transition ${
                    addressType==='existing'
                    ? 'bg-[var(--main-color)] text-white'
                    : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  등록된 배송지
                </button>
                <button 
                  onClick={() => setAddressType('new')} 
                  className={`px-4 py-2 rounded-lg transition ${
                    addressType==='new'
                    ? 'bg-[var(--main-color)] text-white'
                    : 'bg-white text-black border border-gray-200'
                  }`}
                >
                  신규 입력
                </button>
              </div>

              {addressType === 'new' && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      placeholder="우편번호" 
                      value={postcode} 
                      readOnly 
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                    <button 
                      onClick={handlePostcode} 
                      className="px-4 py-2 bg-[var(--main-color)] text-white rounded-lg hover:bg-[var(--sub-color)] transition"
                    >
                      주소찾기
                    </button>
                  </div>
                  <input 
                    placeholder="주소" 
                    value={address} 
                    readOnly 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100"
                  />
                  <input 
                    id="detailAddress" 
                    placeholder="상세주소" 
                    value={detailAddress} 
                    onChange={(e)=>setDetailAddress(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--main-color)]"
                  />
                </div>
              )}
            </div>

            {/* 결제방법 선택 */}
            <div className="bg-[var(--bg-color)] p-6 rounded-[15px]">
              <h2 className="text-[24px] font-bold mb-4 text-black">
                결제방법 선택
              </h2>
              <WidgetCheckoutPage
                amount={finalPrice}
                orderName={orderName}
                onReady={setWidgetReady}
                triggerPayment={triggerPayment}
              />
            </div>
          </div>

          {/* 우측 영역 (30%) */} 
          <div 
            className={`flex-[3] ${isSticky ? 'sticky top-5' : 'relative'} h-fit`}
          > 
            <div className="flex flex-col gap-6">
              {/* 주문정보 */}
              <div className="bg-[var(--bg-color)] p-6 rounded-[15px]"> 
                <h2 className="text-[24px] font-bold mb-4 text-black">주문정보</h2> 
                <div className="flex flex-col gap-4">
                  {orderItems.map((item) => ( 
                    <div key={item.id} className="flex gap-4 items-start"> 
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      /> 
                      <div className="flex flex-col gap-1 flex-1"> 
                        <p className="text-[16px] font-bold text-black"> 
                          {item.title} 
                        </p>
                        <p className="text-[14px] text-gray-600"> 
                          {item.quantity}권 
                        </p> 
                        <p className="text-[16px] text-black"> 
                          {item.price.toLocaleString()}원 
                        </p> 
                        <p className="text-[16px] font-bold text-[var(--main-color)]"> 
                          총 {(item.price * item.quantity).toLocaleString()}원 
                        </p> 
                      </div>
                    </div>
                  ))}
                </div> 
              </div>
              
              {/* 최종 결제 금액 */} 
              <div className="bg-[var(--bg-color)] p-6 rounded-[15px]"> 
                <h2 className="text-[24px] font-bold mb-4 text-black">최종 결제 금액</h2> 
                <div className="flex flex-col gap-3"> 
                  <div className="flex justify-between"> 
                    <span className="text-[16px] text-black">상품금액</span> 
                    <span className="text-[16px] text-black">{totalItemPrice.toLocaleString()}원</span> 
                  </div> 
                  <div className="flex justify-between"> 
                    <span className="text-[16px] text-black">배송비</span> 
                    <span className="text-[16px] text-black">
                      {deliveryFee === 0 ? '무료' : `+${deliveryFee.toLocaleString()}원`}
                    </span> 
                  </div>
                  {isRemote && (
                    <div className="flex justify-between">
                      <span className="text-[16px] text-black">도서산간</span> 
                      <span className="text-[16px] text-black">+{remoteFee.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="h-px bg-[var(--sub-color)] my-2" /> 
                  <div className="flex justify-between">
                    <span className="text-[24px] font-bold text-black">최종 결제 금액</span> 
                    <span className="text-[24px] font-bold text-[var(--main-color)]"> 
                      {finalPrice.toLocaleString()}원 
                    </span> 
                  </div>
                </div>
              </div>
              
              {/* 구매 조건 및 결제 진행 동의 */} 
              <div className="bg-[var(--bg-color)] p-6 rounded-[15px]">
                <label className="flex items-center gap-2 text-[16px] mb-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-[18px] h-[18px]" 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)} 
                  /> 
                  <span className="text-black">구매 조건 및 결제 진행 동의</span>
                </label>
                <div className="bg-white p-4 rounded-lg text-[14px] text-gray-600 space-y-1">
                  <p>• 전자상거래법 제8조에 따른 구매조건 확인</p>
                  <p>• 개인정보 제3자 제공 동의</p>
                  <p>• 전자금융거래 이용약관 동의</p>
                </div>
              </div>
              
              {/* 결제하기 버튼 */}
              <button 
                onClick={handlePaymentClick} 
                disabled={!agreed || !widgetReady}
                className={`w-full text-[24px] font-semibold h-[60px] rounded-[15px] transition ${
                  agreed && widgetReady 
                    ? 'bg-[var(--main-color)] text-white hover:bg-[var(--sub-color)] cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              > 
                {widgetReady ? '결제하기' : '결제 준비 중...'} 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}