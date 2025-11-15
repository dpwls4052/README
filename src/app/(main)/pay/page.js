"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WidgetCheckoutPage from '@/components/pay/WidgetCheckout';
import AddressInput from '@/components/common/AddressInput';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { FiChevronDown, FiChevronUp, FiPackage, FiUser, FiMapPin, FiCreditCard, FiTruck, FiClock, FiX } from 'react-icons/fi';

const Plus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Minus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function PaymentPage() {
  const router = useRouter();

  const [orderItems, setOrderItems] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [cartDeliveryFee, setCartDeliveryFee] = useState(0);
  const [isOrderInfoOpen, setIsOrderInfoOpen] = useState(true);

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const phoneNumber = `${phone1}${phone2}${phone3}`;

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

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: function(data) {
        setPostcode(data.zonecode);
        setAddress(data.roadAddress || data.jibunAddress);
        setTimeout(() => {
          document.getElementById("detailAddress")?.focus();
        }, 100);
      }
    }).open();
  };

  const totalItemPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = totalItemPrice >= 30000 ? 0 : cartDeliveryFee;
  const remoteFee = isRemote ? 5000 : 0;
  const finalPrice = totalItemPrice + deliveryFee + remoteFee;

  const orderName = orderItems.length > 1 
    ? `${orderItems[0]?.title} 외 ${orderItems.length - 1}건`
    : orderItems[0]?.title || '';

  // 예상 배송일 계산
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2);
    return deliveryDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  };

  const handleQuantityChange = (itemId, delta) => {
    setOrderItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId) => {
    if (confirm('이 상품을 주문에서 제외하시겠습니까?')) {
      setOrderItems(prev => prev.filter(item => item.id !== itemId));
      
      // 상품이 모두 삭제되면 장바구니로 이동
      if (orderItems.length === 1) {
        alert('주문 상품이 없습니다.');
        router.push('/cart');
      }
    }
  };

  const handlePaymentClick = () => {
    if (!agreed) {
      alert('구매 조건 및 결제 진행에 동의해주세요.');
      return;
    }
    if (!widgetReady) {
      alert('결제 준비 중입니다. 잠시만 기다려주세요.');
      return;
    }
    
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    
    if (!phone2 || !phone3) {
      alert('연락처를 입력해주세요.');
      return;
    }
    
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    if (addressType === 'new' && (!postcode || !address || !detailAddress)) {
      alert('배송지 정보를 입력해주세요.');
      return;
    }
    
    const paymentData = {
      phoneNumber,
      orderName,
      finalPrice,
      orderItems,
      address: addressType === 'new' ? `${address} ${detailAddress}` : '등록된 배송지',
      postcode,
    };
    
    localStorage.setItem("paymentData", JSON.stringify(paymentData));
    setTriggerPayment(prev => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen">
        {/* 헤더 영역 */}
        <div className="border-b sticky top-0 z-50 bg-white shadow-sm">
          <div className="max-w-1200 mx-auto px-5 py-5">
            <h1 className="text-24 font-bold text-black">주문 / 결제</h1>
          </div>
        </div>

        <div className="max-w-1200 mx-auto px-5 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 왼쪽 영역 */}
            <div className="flex-[2] flex flex-col gap-5">
              {/* 주문한 상품 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div 
                  className="bg-[var(--main-color)] p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => setIsOrderInfoOpen(!isOrderInfoOpen)}
                >
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-white" size={20} />
                    <h2 className="text-18 font-bold text-white">주문 상품</h2>
                    <span className="bg-white/30 text-white text-sm px-2 py-1 rounded-lg">
                      {orderItems.length}개
                    </span>
                  </div>
                  <div className="text-white">
                    {isOrderInfoOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </div>

                {isOrderInfoOpen && (
                  <div className="p-5 space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-4 px-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center gap-4 flex-1">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-100 h-auto rounded-lg object-cover" 
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="text-base font-medium text-black">{item.title}</p>
                            <p className="text-lg font-bold text-[var(--main-color)]">{item.price.toLocaleString()}원</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-2 bg-[var(--sub-color)] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                            >
                              <Minus />
                            </button>
                            <span className="font-medium min-w-[40px] text-center text-black">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-2 bg-[var(--sub-color)] text-white rounded-lg hover:opacity-90"
                            >
                              <Plus />
                            </button>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-lg font-bold text-black mb-1">
                              {(item.price * item.quantity).toLocaleString()}원
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="삭제"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 주문자 정보 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-black" size={20} />
                    <h2 className="text-18 font-bold text-black">주문 고객</h2>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">이름</label>
                    <input 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black" 
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">연락처</label>
                    <div className="flex items-center gap-2">
                      <input 
                        value={phone1} 
                        onChange={e => setPhone1(e.target.value.replace(/[^0-9]/g,''))} 
                        maxLength={3} 
                        className="flex-1 px-3 py-2 text-center bg-white rounded-lg border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        value={phone2} 
                        onChange={e => setPhone2(e.target.value.replace(/[^0-9]/g,''))} 
                        maxLength={4} 
                        className="flex-1 px-3 py-2 text-center bg-white rounded-lg border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        value={phone3} 
                        onChange={e => setPhone3(e.target.value.replace(/[^0-9]/g,''))} 
                        maxLength={4} 
                        className="flex-1 px-3 py-2 text-center bg-white rounded-lg border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">이메일</label>
                    <input 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="example@email.com" 
                      className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:border-[var(--main-color)] focus:outline-none transition-colors text-black"
                    />
                  </div>
                </div>
              </div>

              {/* 배송지 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-black" size={20} />
                    <h2 className="text-18 font-bold text-black">배송지</h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-5">
                    <button 
                      onClick={() => setAddressType('existing')} 
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        addressType === 'existing' 
                          ? 'bg-[var(--main-color)] text-white' 
                          : 'bg-[var(--bg-color)] text-black hover:bg-gray-200'
                      }`}
                    >
                      등록된 배송지
                    </button>
                    <button 
                      onClick={() => setAddressType('new')} 
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        addressType === 'new' 
                          ? 'bg-[var(--main-color)] text-white' 
                          : 'bg-[var(--bg-color)] text-black hover:bg-gray-200'
                      }`}
                    >
                      신규 입력
                    </button>
                  </div>
                  {addressType === 'new' && (
                    <AddressInput 
                      postcode={postcode} 
                      address={address} 
                      detailAddress={detailAddress} 
                      onDetailAddressChange={setDetailAddress} 
                      onPostcodeSearch={handlePostcode} 
                    />
                  )}
                  {/* 도서산간지역 배송비 추가 */}
                  {/* {addressType === 'new' && (
                    <label className="flex items-center gap-2 p-3 bg-[var(--bg-color)] rounded-lg cursor-pointer hover:bg-gray-200 transition-colors mt-3">
                      <input 
                        type="checkbox" 
                        checked={isRemote}
                        onChange={e => setIsRemote(e.target.checked)}
                        className="w-18 h-18 rounded"
                      />
                      <span className="text-black text-sm">도서산간 지역 (+5,000원)</span>
                    </label>
                  )} */}
                </div>
              </div>

              {/* 결제 위젯 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-[var(--bg-color)] p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-black" size={20} />
                    <h2 className="text-18 font-bold text-black">결제방법 선택</h2>
                  </div>
                </div>
                <div className="p-5">
                  <WidgetCheckoutPage amount={finalPrice} orderName={orderName} onReady={setWidgetReady} triggerPayment={triggerPayment} />
                </div>
              </div>
            </div>

            {/* 우측 영역 */}
            <div className={`${isSticky ? 'sticky top-24' : 'relative'} flex-[1] h-fit space-y-5`}>
              {/* 예상 배송 정보 */}
              <div className="bg-[var(--bg-color)] p-5 rounded-15 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FiTruck className="text-[var(--main-color)]" size={18} />
                  <h3 className="text-base font-bold text-black">배송 정보</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-black">
                    <span className="text-gray-600">배송 방법</span>
                    <span className="font-medium">일반배송</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span className="text-gray-600">도착 예정</span>
                    <span className="font-medium text-[var(--main-color)]">{getEstimatedDelivery()}</span>
                  </div>
                </div>
              </div>

              {/* 결제 정보 */}
              <div className="bg-[var(--bg-color)] p-5 rounded-15 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-black">결제 정보</h2>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between text-black text-sm">
                    <span>상품 금액</span>
                    <span className="font-medium">{totalItemPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-black text-sm">
                    <span>배송비</span>
                    <span className="font-medium">{deliveryFee === 0 ? "무료" : `+${deliveryFee.toLocaleString()}원`}</span>
                  </div>
                  {isRemote && (
                    <div className="flex justify-between text-black text-sm">
                      <span>도서산간비</span>
                      <span className="font-medium">+{remoteFee.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="border-b border-gray-200 my-2" />
                  <div className="flex justify-between text-lg font-bold text-black">
                    <span>최종 결제금액</span>
                    <span className="text-[var(--main-color)]">{finalPrice.toLocaleString()}원</span>
                  </div>
                </div>
                
                {/* 구매 동의 */}
                <label className="flex items-start gap-2 mb-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={e => setAgreed(e.target.checked)}
                    className="w-18 h-18 mt-0.5 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-black block mb-1">
                      구매 조건 및 결제 진행에 동의
                    </span>
                    <div className="text-xs text-gray-500">
                      <p>• 전자상거래법 제8조 구매조건 확인</p>
                      <p>• 개인정보 제3자 제공 동의</p>
                      <p>• 전자금융거래 이용약관 동의</p>
                    </div>
                  </div>
                </label>

                {/* 결제 버튼 */}
                <button 
                  onClick={handlePaymentClick}
                  disabled={!agreed || !widgetReady}
                  className={`w-full py-3 rounded-lg font-bold text-base transition-all ${
                    agreed && widgetReady
                      ? 'bg-[var(--main-color)] text-white hover:opacity-90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {widgetReady ? '결제하기' : '결제 준비 중...'}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  30,000원 이상 구매 시 배송비 무료
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}