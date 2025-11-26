"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/common/useAuth";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";

const DeliveryManagement = () => {
  const { userId } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");

  // 관리자 권한 확인 및 주문 내역 조회
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 관리자 권한 확인 및 주문 조회
        const res = await fetch(`/api/order/admin/getAllOrders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("서버 응답이 올바르지 않습니다.");
        }

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            setIsAdmin(false);
            throw new Error("관리자 권한이 없습니다.");
          }
          throw new Error(data.error || "주문 내역 조회 실패");
        }

        setIsAdmin(true);
        setOrders(data);
      } catch (err) {
        console.error("주문 조회 에러:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 배송 상태 변경
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/admin/updateShippingStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          order_id: orderId,
          shipping_status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "상태 변경 실패");

      // 상태 업데이트
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId
            ? { ...order, shipping_status: newStatus }
            : order
        )
      );

      alert("배송 상태가 변경되었습니다.");
    } catch (err) {
      console.error("상태 변경 에러:", err);
      alert(err.message);
    }
  };

  // 주문 번호별로 그룹화
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.order_number]) {
      acc[order.order_number] = {
        orderNumber: order.order_number,
        orderId: order.order_id,
        orderDate: order.date,
        totalPrice: 0,
        status: order.status,
        shippingStatus: order.shipping_status,
        customerInfo: {
          name: order.name,
          phone: order.phone,
          email: order.email,
          address: `${order.address1} ${order.address2}`,
          postalCode: order.postal_code,
          memo: order.memo,
        },
        items: [],
      };
    }
    acc[order.order_number].totalPrice += order.book_price * order.amount;
    acc[order.order_number].items.push(order);
    return acc;
  }, {});

  const orderList = Object.values(groupedOrders);

  // 탭별 필터링
  const filteredOrders = orderList.filter((order) => {
    if (activeTab === "전체") return true;
    if (activeTab === "결제완료") return order.shippingStatus === "결제완료";
    if (activeTab === "배송준비") return order.shippingStatus === "배송준비";
    if (activeTab === "배송중") return order.shippingStatus === "배송중";
    if (activeTab === "배송완료") return order.shippingStatus === "배송완료";
    if (activeTab === "주문취소") return order.shippingStatus === "주문취소";
    return true;
  });

  // 통계 계산
  const stats = {
    total: orderList.length,
    paid: orderList.filter((o) => o.shippingStatus === "결제완료").length,
    preparing: orderList.filter((o) => o.shippingStatus === "배송준비").length,
    shipping: orderList.filter((o) => o.shippingStatus === "배송중").length,
    delivered: orderList.filter((o) => o.shippingStatus === "배송완료").length,
    cancelled: orderList.filter((o) => o.shippingStatus === "주문취소").length,
  };

  if (loading) return <p className="mt-20 text-center">로딩 중...</p>;
  if (!userId) return <p className="mt-20 text-center">로그인이 필요합니다.</p>;
  if (!isAdmin)
    return <p className="mt-20 text-center">관리자 권한이 없습니다.</p>;

  return (
    <section className="flex justify-center w-full overflow-y-scroll bg-white scrollbar-hide">
      <div className="w-full p-10">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-32 text-(--main-color)">배송 관리</h1>

          {/* 주문 통계 */}
          <div className="flex text-center gap-30">
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-sm font-normal text-gray-500">결제완료</p>
              <div className="flex items-center gap-8">
                <FiCheckCircle className="text-2xl text-purple-600" />
                <p className="text-lg font-semibold">{stats.paid}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-sm font-normal text-gray-500">배송준비</p>
              <div className="flex items-center gap-8">
                <FiPackage className="text-2xl text-orange-600" />
                <p className="text-lg font-semibold">{stats.preparing}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-sm font-normal text-gray-500">배송중</p>
              <div className="flex items-center gap-8">
                <FiTruck className="text-2xl text-blue-600" />
                <p className="text-lg font-semibold">{stats.shipping}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-sm font-normal text-gray-500">배송완료</p>
              <div className="flex items-center gap-8">
                <FiCheckCircle className="text-2xl text-green-700" />
                <p className="text-lg font-semibold">{stats.delivered}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-sm font-normal text-gray-500">주문취소</p>
              <div className="flex items-center gap-8">
                <FiXCircle className="text-2xl text-red-600" />
                <p className="text-lg font-semibold">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex pb-2 my-20 overflow-x-auto overflow-y-visible border-b-2 border-gray-200 flex-nowrap gap-30">
          {[
            "전체",
            "결제완료",
            "배송준비",
            "배송중",
            "배송완료",
            "주문취소",
          ].map((tab) => (
            <button
              key={tab}
              className={`pb-10 px-2 font-normal text-20 transition-colors shrink-0 box-border ${
                activeTab === tab
                  ? "border-b-2 border-(--main-color) text-(--main-color) -mb-2"
                  : "text-gray-600 hover:text-(--main-color)"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 주문 목록 */}
        <div className="space-y-20">
          {filteredOrders.length === 0 ? (
            <div className="py-40 text-center text-gray-500">
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
                className="border rounded-lg p-20 bg-(--bg-color) space-y-15"
              >
                {/* 주문 헤더 */}
                <div className="flex items-center justify-between border-b pb-15">
                  <div className="space-y-5">
                    <p className="font-semibold text-18">
                      주문번호: {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      주문일:{" "}
                      {new Date(order.orderDate).toLocaleString("ko-KR")}
                    </p>
                    <p className="text-sm text-gray-600">
                      주문자: {order.customerInfo.name} (
                      {order.customerInfo.phone})
                    </p>
                  </div>

                  {/* 배송 상태 선택 드롭다운 */}
                  <div className="flex items-center gap-10">
                    <select
                      value={order.shippingStatus}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className={`px-12 py-8 rounded border text-sm font-medium cursor-pointer ${
                        order.shippingStatus === "배송완료"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : order.shippingStatus === "배송중"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : order.shippingStatus === "배송준비"
                          ? "bg-orange-100 text-orange-700 border-orange-300"
                          : order.shippingStatus === "주문취소"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-purple-100 text-purple-700 border-purple-300"
                      }`}
                    >
                      <option value="결제완료">결제완료</option>
                      <option value="배송준비">배송준비</option>
                      <option value="배송중">배송중</option>
                      <option value="배송완료">배송완료</option>
                      <option value="주문취소">주문취소</option>
                    </select>
                  </div>
                </div>

                {/* 배송지 정보 */}
                <div className="rounded p-15">
                  <p className="mb-8 font-medium text-gray-700 text-14">
                    배송지 정보
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      📍 {order.customerInfo.address} (
                      {order.customerInfo.postalCode})
                    </p>
                    <p>📧 {order.customerInfo.email}</p>
                    {order.customerInfo.memo && (
                      <p className="text-orange-600">
                        📝 요청사항: {order.customerInfo.memo}
                      </p>
                    )}
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="space-y-10">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center rounded gap-15 p-15"
                    >
                      <img
                        src={item.cover || "https://placehold.co/80x110"}
                        alt={item.title}
                        className="object-cover border rounded w-80 h-110"
                      />
                      <div className="flex-1">
                        <p className="mb-5 font-medium text-16">{item.title}</p>
                        <p className="mb-5 text-sm text-gray-600">
                          {item.book_price?.toLocaleString()}원 × {item.amount}
                          개
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-18 text-(--main-color)">
                          {(item.book_price * item.amount).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 주문 합계 */}
                <div className="flex items-center justify-between border-t pt-15">
                  <p className="font-semibold text-16">총 결제금액</p>
                  <p className="font-bold text-20 text-(--main-color)">
                    {order.totalPrice?.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DeliveryManagement;
