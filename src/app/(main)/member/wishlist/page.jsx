"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "@/components/common/AddToCartButton";
import WishListButton from "@/components/common/WishListButton";
import { useAuth } from "@/hooks/common/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { auth } from "@/lib/firebase";

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
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(`/api/user/wishlist`, {
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "위시리스트 조회 실패");

        setItems(
          data.map((item) => ({
            id: item.book_id,
            name: item.title || `도서 ${item.book_id}`,
            price: item.price_standard || 0,
            image: item.cover || "https://via.placeholder.com/80",
            stock: item.stock || 0,
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

  if (loading) return <p className="mt-20 text-center">로딩 중...</p>;
  if (!userId) return <p className="mt-20 text-center">로그인이 필요합니다.</p>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 bg-white">
        <div className="px-5 mx-auto max-w-1200 pt-50">
          <div className="flex flex-col gap-20 lg:flex-row">
            <div className="flex-2 ">
              <h2 className="mb-20 text-3xl font-bold">위시리스트</h2>
              {items.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-500">
                    위시리스트가 비어 있습니다.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-200 py-15 gap-15"
                    >
                      <div className="flex items-start gap-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover border border-gray-300 rounded-md cursor-pointer w-100 h-140"
                          onClick={() =>
                            (window.location.href = `/product/detail/${item.id}`)
                          }
                        />
                        <div
                          className="flex flex-col flex-1 gap-1 cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/product/detail/${item.id}`)
                          }
                        >
                          <span className="mt-5 text-base font-medium text-black">
                            {item.name}
                          </span>
                          <span className="text-lg font-bold text-[var(--main-color)]">
                            {item.price.toLocaleString()}원
                          </span>
                          <span
                            className={`text-sm font-medium mt-1`}
                            style={{
                              color:
                                item.stock > 0
                                  ? "var(--sub-color)"
                                  : "rgb(220, 38, 38)",
                            }}
                          >
                            {item.stock > 0 ? `재고 ${item.stock}권` : "품절"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        {/* 🌟 WishListButton 컴포넌트 사용 */}
                        <WishListButton
                          userId={userId}
                          bookId={item.id}
                          wishlist={true}
                        />
                        <AddToCartButton
                          book={{
                            bookId: item.id,
                          }}
                          iconMode={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 bg-[var(--bg-color)] p-20 rounded-md shadow-sm h-fit lg:sticky lg:top-200">
              <h2 className="text-xl font-bold text-black mb-30">
                위시리스트 정보
              </h2>
              <div className="flex flex-col mb-4 gap-25">
                <div className="flex justify-between">
                  <span className="font-normal text-black">상품 수</span>
                  <span className="font-bold text-black">{items.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-normal text-black">총 금액</span>
                  <span className="font-bold text-[var(--main-color)]">
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
