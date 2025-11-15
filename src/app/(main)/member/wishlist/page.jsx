"use client";

import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import AddToCartButton from "@/components/common/AddToCartButton";
import { useAuth } from "@/hooks/common/useAuth";

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

        setItems(data.map(item => ({
          id: item.book_id,
          name: item.title || `도서 ${item.book_id}`,
          price: item.price_standard || 0,
          image: item.cover || "https://via.placeholder.com/80",
        })));
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
    setItems(prev => prev.filter(item => item.id !== bookId));

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
    <div className="min-h-screen py-10 bg-white">
      <div className="max-w-1200 mx-auto px-5">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-2 bg-gray-50 p-5 rounded-15 shadow-sm">
            <h2 className="text-2xl font-bold mb-5 text-black">위시리스트</h2>
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">위시리스트가 비어 있습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-200">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-10">
                    <div className="flex items-center gap-20">
                      <img src={item.image} alt={item.name} className="w-100 h-auto object-cover rounded-lg" />
                      <div className="flex flex-col">
                        <span className="text-black font-medium">{item.name}</span>
                        <span className="text-(--main-color) font-bold">{item.price.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="flex gap-10">
                      <button onClick={() => handleToggleHeart(item.id)} className="text-red-600 hover:bg-red-100 p-5 rounded">
                        <FaHeart size={20} />
                      </button>
                      <AddToCartButton book={{ bookId: item.id }} iconMode={true} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 bg-gray-50 p-5 rounded-15 shadow-sm h-fit lg:sticky lg:top-5">
            <h2 className="text-2xl font-bold mb-5 text-black">위시리스트 정보</h2>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between">
                <span className="text-black">상품 수</span>
                <span className="font-bold text-black">{items.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">총 금액</span>
                <span className="font-bold text-(--main-color)">{items.reduce((acc, i) => acc + i.price, 0).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
