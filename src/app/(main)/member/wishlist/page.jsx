"use client";

import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import AddToCartButton from "@/components/common/AddToCartButton";
import { useAuth } from "@/hooks/common/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setItems([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/wishlist?user_id=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "위시리스트 조회 실패");

        setItems(
          data.map((item) => ({
            id: item.book_id,
            name: item.title || `도서 ${item.book_id}`,
            price: item.price_standard || 0,
            image: item.cover || "https://via.placeholder.com/80",
            stock: item.stock || 0, // ✅ stock 추가
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleToggleHeart = async (bookId) => {
    if (!userId) return alert("로그인이 필요합니다.");
    setItems((prev) => prev.filter((item) => item.id !== bookId));

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
      });
      if (!res.ok) console.error(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-20">로딩 중...</p>;
  if (!userId) return <p className="text-center mt-20">로그인이 필요합니다.</p>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 bg-white">
        <div className="max-w-1200 mx-auto px-5 pt-50">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-2 ">
              <h2 className="text-3xl font-bold mb-20">위시리스트</h2>
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    위시리스트가 비어 있습니다.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-15 gap-15 border-b border-gray-200"
                    >
                      <div className="flex items-start gap-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-100 h-140 object-cover rounded-md border border-gray-300"
                        />
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-base text-black font-medium mt-5">
                            {item.name}
                          </span>
                          <span className="text-lg font-bold text-[var(--main-color)]">
                            {item.price.toLocaleString()}원
                          </span>
                          {/* ✅ 재고 표시 추가 */}
                          <span className={`text-sm font-medium mt-1`}
                            style={{ color: item.stock > 0 ? "var(--sub-color)" : "rgb(220, 38, 38)" }}
                          >
                            {item.stock > 0 ? `재고 ${item.stock}권` : "품절"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-10">
                        <button
                          onClick={() => handleToggleHeart(item.id)}
                          className="text-red-600 hover:bg-red-100 p-5 rounded hover:cursor-pointer"
                        >
                          <FaHeart size={20} />
                        </button>
                        {/* ✅ stock 전달 */}
                        <AddToCartButton
                          book={{ 
                            bookId: item.id,
                            stock: item.stock 
                          }}
                          iconMode={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 bg-[var(--bg-color)] p-20 rounded-md shadow-sm h-fit  lg:sticky lg:top-200">
              <h2 className="text-xl font-bold mb-30 text-black">
                위시리스트 정보
              </h2>
              <div className="flex flex-col gap-25 mb-4">
                <div className="flex justify-between">
                  <span className="text-black font-normal">상품 수</span>
                  <span className="font-bold text-black">{items.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-normal">총 금액</span>
                  <span className="font-bold text-(--main-color)">
                    {items
                      .reduce((acc, i) => acc + i.price, 0)
                      .toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Wishlist;