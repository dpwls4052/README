"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/common/useAuth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { FiPackage, FiTruck, FiCheckCircle } from "react-icons/fi";

export default function Orders() {
  const router = useRouter();
  const { userId } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("전체");

  // 주문 내역 조회
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/orders/getOrders`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userId })
        });

        // HTML 에러 체크
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("서버 응답이 올바르지 않습니다. API 경로를 확인하세요.");
        }
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "주문 내역 조회 실패");
        
        setOrders(data);
      } catch (err) {
        console.error("주문 조회 에러:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // 주문 번호별로 그룹화
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.order_number]) {
      acc[order.order_number] = {
        orderNumber: order.order_number,
        orderDate: order.date,
        totalPrice: 0,
        status: order.status,
        shippingStatus: order.shipping_status,
        items: [],
      };
    }
    // 총 가격 누적
    acc[order.order_number].totalPrice += (order.book_price * order.amount);
    acc[order.order_number].items.push(order);
    return acc;
  }, {});

  const orderList = Object.values(groupedOrders);

  // 탭별 필터링 (shipping_status 기준)
  const filteredOrders = orderList.filter(order => {
    if (activeTab === "전체") return true;
    if (activeTab === "배송준비") return order.shippingStatus === "배송준비";
    if (activeTab === "배송중") return order.shippingStatus === "배송중";
    if (activeTab === "배송완료") return order.shippingStatus === "배송완료";
    return true;
  });

  // 통계 계산
  const stats = {
    total: orderList.length,
    preparing: orderList.filter(o => o.shippingStatus === "배송준비").length,
    shipping: orderList.filter(o => o.shippingStatus === "배송중").length,
    delivered: orderList.filter(o => o.shippingStatus === "배송완료").length,
  };

  if (loading) return <p className="text-center mt-20">로딩 중...</p>;
  if (!userId) return <p className="text-center mt-20">로그인이 필요합니다.</p>;

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-5xl p-10 space-y-50">
          
          {/* 상단 헤더 */}
          <div className="flex justify-between items-center border-b py-50">
            <section>
              <h2 className="text-3xl font-semibold text-[#0A400C] mb-15">
                주문 내역
              </h2>
              <p className="text-black-900 text-xl font-semibold mb-2">
                주문하신 상품의 배송 상태를 확인하세요
              </p>
            </section>

            {/* 주문 통계 */}
            <section>
              <div className="flex gap-40 text-center mr-30">
                <div className="flex flex-col justify-center items-center gap-6">
                  <p className="text-sm font-normal text-gray-500">배송준비</p>
                  <div className="flex gap-8 items-center">
                    <FiPackage className="mx-auto text-2xl text-orange-600" />
                    <p className="text-lg font-semibold">{stats.preparing}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-6">
                  <p className="text-sm font-normal text-gray-500">배송중</p>
                  <div className="flex gap-8 items-center">
                    <FiTruck className="mx-auto text-2xl text-blue-600" />
                    <p className="text-lg font-semibold">{stats.shipping}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-6">
                  <p className="text-sm font-normal text-gray-500">배송완료</p>
                  <div className="flex gap-8 items-center">
                    <FiCheckCircle className="mx-auto text-2xl text-green-700" />
                    <p className="text-lg font-semibold">{stats.delivered}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex gap-30 border-b-2 border-gray-200 ">
            {["전체", "배송준비", "배송중", "배송완료"].map((tab) => (
              <button
                key={tab}
                className={`pb-10 px-2 font-normal text-20 cursor-pointer transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--main-color)] text-[var(--main-color)] -mb-[2px]"
                    : "text-gray-600 hover:text-[var(--main-color)]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 주문 목록 */}
          <section className="space-y-20">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-40 bg-[var(--bg-color)]">
                <p className="text-lg">
                  {activeTab === "전체" 
                    ? "주문 내역이 없습니다." 
                    : `${activeTab} 상태의 주문이 없습니다.`}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="border rounded-lg p-20 bg-[var(--bg-color)] space-y-15"
                >
                  {/* 주문 헤더 */}
                  <div className="flex justify-between items-center border-b pb-15">
                    <div className="space-y-5">
                      <p className="font-semibold text-18">
                        주문번호: {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        주문일: {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-12 py-6 rounded text-sm font-medium ${
                          order.shippingStatus === "배송완료"
                            ? "bg-green-100 text-green-700"
                            : order.shippingStatus === "배송중"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.shippingStatus}
                      </span>
                    </div>
                  </div>

                  {/* 주문 상품 목록 */}
                  <div className="space-y-10">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-15 items-center p-15 rounded"
                      >
                        <img
                          src={item.cover || "https://placehold.co/80x110"}
                          alt={item.title}
                          className="w-80 h-110 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-16 mb-5">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 mb-5">
                            {item.book_price?.toLocaleString()}원 × {item.amount}개
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-18 text-[var(--main-color)]">
                            {(item.book_price * item.amount).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 주문 합계 */}
                  <div className="border-t pt-15 flex justify-between items-center">
                    <p className="font-semibold text-16">총 결제금액</p>
                    <p className="font-bold text-20 text-[var(--main-color)]">
                      {order.totalPrice?.toLocaleString()}원
                    </p>
                  </div>

                  {/* 버튼 */}
                  {order.shippingStatus === "배송완료" && (
                    <div className="flex gap-10 justify-end">
                      <button className="px-15 py-8 bg-[var(--main-color)] text-white rounded text-sm hover:opacity-90 transition">
                        리뷰 작성
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}