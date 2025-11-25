// app/pay/success/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useCartCount } from '@/hooks/common/useCartCount'; // ✅ 추가

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { removeFromCart } = useCartCount(); // ✅ 추가
    const [loading, setLoading] = useState(true);
    const [isDbSaved, setIsDbSaved] = useState(false);
    const [error, setError] = useState(null);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);


    useEffect(() => {
        console.log("🚀 Success 페이지 useEffect 시작");
        
        // 1. URL 파라미터 유효성 검사 제거됨
        
        // 2. 로컬 스토리지에서 주문 데이터 로드
        const storedData = localStorage.getItem("pendingOrderData");
        console.log("📦 로컬스토리지 데이터:", storedData ? "있음" : "없음");
        
        if (!storedData) {
            // ✅ 이미 DB에 저장되어 있다면 (orderNumber가 있으면) 에러 표시 안함
            if (isDbSaved && orderNumber) {
                console.log("✅ 이미 처리 완료된 주문 (정상)");
                setLoading(false);
                return;
            }
            
            // ✅ 정말 데이터가 없는 경우만 에러
            console.log("⚠️ pendingOrderData 없음 - 결제 페이지에서 데이터 저장 실패 가능성");
            setError('주문 정보(pendingOrderData)를 찾을 수 없습니다. 결제 페이지로 돌아가 다시 시도해주세요.');
            setLoading(false);
            return;
        }

        let orderPayload;
        try {
            orderPayload = JSON.parse(storedData);
            // console.log("✅ orderPayload 파싱 성공:", orderPayload);
        } catch (parseError) {
            // console.error("❌ pendingOrderData 파싱 실패:", parseError);
            setError("주문 정보 형식이 올바르지 않습니다. 결제 페이지로 돌아가 다시 시도해주세요.");
            setLoading(false);
            return;
        }
        setOrderInfo(orderPayload);
        
        // 3. 서버에 최종 주문 데이터 전송 (DB 저장)
        const saveOrderToDB = async () => {
            try {
                const finalPayload = orderPayload;
                // console.log("📮 API 호출 시작:", finalPayload);

                const res = await fetch("/api/order/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(finalPayload),
                });

                // console.log("📡 API 응답 상태:", res.status, res.ok);
                const result = await res.json();
                // console.log("📊 API 응답 데이터:", result);

                if (res.ok && result.success) {
                    // console.log("✅ 주문 저장 성공!");
                    setIsDbSaved(true);
                    setOrderNumber(result.orderNumber);
                    
                    // ✅ 성공적으로 저장 후 헤더 카운트 업데이트
                    if (orderPayload.orderItems && Array.isArray(orderPayload.orderItems)) {
                        console.log("🛒 장바구니 카운트 업데이트 시작:", orderPayload.orderItems.length, "개");
                        orderPayload.orderItems.forEach(item => {
                            const bookId = item.book_id || item.id || item.bookId;
                            console.log("  - 제거:", bookId);
                            if (bookId) {
                                removeFromCart(bookId);
                            }
                        });
                    }
                    
                    // 로컬 스토리지 데이터 삭제
                    localStorage.removeItem("pendingOrderData");
                    // console.log("🗑️ pendingOrderData 삭제 완료");
                } else {
                    // console.error("❌ DB 저장 실패:", result.errorMessage);
                    setError(`주문 저장 실패: ${result.errorMessage || '알 수 없는 오류'}`);
                }
            } catch (e) {
                // console.error("💥 주문 API 통신 오류:", e);
                setError(`서버 통신 오류: ${e.message}`);
            } finally {
                setLoading(false);
                // console.log("🏁 saveOrderToDB 종료");
            }
        };

        saveOrderToDB();
        
        // ✅ cleanup 함수에서 플래그 유지 (리셋하지 않음)
    }, [removeFromCart]); // ✅ 의존성 배열에 추가

    // ✅ cartData 로컬스토리지 정리는 제거 (API에서 이미 처리됨)
    // useEffect(() => {
    //     if (!orderInfo) return;
    //     const storedCart = localStorage.getItem("cartData");
    //     ...
    // }, [orderInfo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-xl text-[var(--main-color)] font-semibold">
                    주문 정보를 확인하고 있습니다...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center bg-red-50 rounded-lg shadow-lg my-20">
                <FiAlertCircle className="text-red-600 mx-auto mb-4" size={50} />
                <h2 className="text-2xl font-bold text-red-600 mb-4">주문 처리 실패</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <p className="text-sm text-gray-500">결제는 완료되었을 수 있습니다. 관리자에게 문의해주세요.</p>
                <button onClick={() => router.push('/')} className="mt-8 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    메인으로 돌아가기
                </button>
            </div>
        );
    }
    
    // 최종 성공 화면
    return (
        <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-lg shadow-xl my-20 border-t-4 border-[var(--main-color)]">
            <FiCheckCircle className="text-[var(--main-color)] mx-auto mb-4" size={60} />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">결제가 완료되었습니다!</h2>
            
            <div className="bg-gray-50 p-6 rounded-md space-y-3 mb-8">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-lg font-medium text-gray-600">주문 번호</span>
                    <span className="text-xl font-bold text-gray-800">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-600">총 결제 금액</span>
                    <span className="text-2xl font-extrabold text-[var(--main-color)]">
                        {(orderInfo?.price || 0).toLocaleString()}원
                    </span>
                </div>
            </div>

            <p className="text-gray-600 mb-8">
                성공적으로 주문이 처리되었습니다. 배송은 영업일 기준 3~5일 이내 시작됩니다.
            </p>

            <button onClick={() => router.push('/member?MemberTab=orders')} className="w-full py-3 bg-[var(--main-color)] text-white text-lg font-bold rounded-lg hover:bg-green-700 transition-colors">
                주문 상세 내역 확인
            </button>
        </div>
    );
}