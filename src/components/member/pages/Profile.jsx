"use client";

import { useEffect, useState } from "react";
import { FaBookOpen, FaGift, FaRegHeart } from "react-icons/fa";
import { useAuth } from "@/hooks/common/useAuth";
import Modal from "@/components/common/Modal";
import AddressInput from "@/components/common/AddressInput";
import { getAuth, deleteUser } from "firebase/auth";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase";

import Image from "next/image";
import noimg from "@/assets/no_image.png";
import { toast } from "sonner";

export default function Profile() {
  const { userId } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [userInfo, setUserInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [modalValue, setModalValue] = useState("");

  // 주소 관리 상태
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [editForm, setEditForm] = useState({
    nickname: "",
    postcode: "",
    address: "",
    detailAddress: "",
  });
  const [newAddressForm, setNewAddressForm] = useState({
    nickname: "",
    postcode: "",
    address: "",
    detailAddress: "",
  });
  // 최근 본 도서 상태
  const [recentBooks, setRecentBooks] = useState([]);

  const handleDeleteAccount = async () => {
    const idToken = await auth.currentUser.getIdToken();
    if (!confirm("정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) return;

    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        alert("로그인 정보를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.");
        return;
      }

      // Firebase 계정 삭제
      try {
        await deleteUser(firebaseUser);
        console.log("Firebase 계정 삭제 완료");
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          alert("보안을 위해 다시 로그인 후 탈퇴해주세요.");
          window.location.href = "/login";
          return;
        }
        throw err;
      }

      // Supabase users 테이블 유저 삭제
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        alert("Supabase DB 삭제 실패: " + data.error);
        return;
      }

      toast.success("회원 탈퇴가 완료되었습니다.");

      // 쿠키 삭제 (로그아웃)
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970; path=/;";

      // 홈으로 이동
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("회원 탈퇴 중 오류 발생: " + err.message);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchCounts = async () => {
      // 주문 개수
      const { count: orders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 찜 개수
      const { count: wishlist } = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", true);

      // 리뷰 개수
      const { count: reviews } = await supabase
        .from("review")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      setOrderCount(orders || 0);
      setWishlistCount(wishlist || 0);
      setReviewCount(reviews || 0);
    };

    fetchCounts();
  }, [userId]);

  // 다음 우편번호 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 기본 주소 가져오기
  useEffect(() => {
    if (!userId) return;
    fetchAddressList();
  }, [userId]);

  // 사용자 정보 조회
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const idToken = await auth.currentUser.getIdToken();
      try {
        const res = await fetch("/api/user/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
        const data = await res.json();
        setUserInfo(data.user);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, [userId]);

  // 최근 본 도서 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchRecentBooks = async () => {
      const idToken = await auth.currentUser.getIdToken();
      try {
        const res = await fetch("/api/user/recentBooks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setRecentBooks(data.books);
        }
      } catch (err) {
        console.error("최근 본 도서 불러오기 실패:", err);
      }
    };

    fetchRecentBooks();
  }, [userId]);

  // 주소 목록 조회
  const fetchAddressList = async () => {
    const idToken = await auth.currentUser.getIdToken();
    if (!userId) return;

    try {
      const res = await fetch("/api/user/address/getAddressList", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        // console.log("조회된 주소 목록:", data.addresses);
        setAddressList(data.addresses);
      }
    } catch (err) {
      console.error("주소 목록 조회 실패:", err);
    }
  };

  // 주소 모달 열 때 목록 불러오기
  useEffect(() => {
    if (addressModalOpen && userId) {
      fetchAddressList();
      setEditingAddressIdx(null);
    }
  }, [addressModalOpen, userId]);

  // 필드 수정 API
  const updateUserField = async () => {
    if (!modalField || !modalValue) return;

    try {
      const endpointMap = {
        name: "update/name",
        phone: "update/phone",
        // email: "update/email",
      };

      const payload = {};
      if (modalField === "name") payload.newName = modalValue;
      else if (modalField === "phone") payload.newPhone = modalValue;
      // else if (modalField === "email") payload.newEmail = modalValue;

      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/user/${endpointMap[modalField]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.errorMessage || "수정 실패");

      setUserInfo((prev) => ({
        ...prev,
        [modalField === "phone" ? "phone_number" : modalField]: modalValue,
      }));

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // 주소 모달 열기
  const openAddressModal = () => {
    setAddressModalOpen(true);
    setEditingAddressIdx(null);
    setNewAddressForm({
      nickname: "",
      postcode: "",
      address: "",
      detailAddress: "",
    });
  };

  // 주소 수정 시작
  const startEditAddress = (addr) => {
    setEditingAddressIdx(addr.address_id);
    setEditForm({
      nickname: addr.nickname,
      postcode: addr.postcode,
      address: addr.road_address,
      detailAddress: addr.detail_address || "",
    });
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingAddressIdx(null);
    setEditForm({
      nickname: "",
      postcode: "",
      address: "",
      detailAddress: "",
    });
  };

  // 주소 저장 (수정)
  const saveAddress = async (addressIdx) => {
    console.log("=== saveAddress 호출 ===");
    console.log("전달받은 addressIdx:", addressIdx);
    console.log("현재 userId:", userId);
    console.log("현재 addressList:", addressList);
    const idToken = await auth.currentUser.getIdToken();

    if (!userId) {
      alert("userId가 없습니다. 다시 로그인해주세요.");
      return;
    }

    if (!addressIdx) {
      alert("addressIdx가 없습니다.");
      return;
    }

    if (!editForm.nickname.trim()) {
      toast.warning("주소 닉네임을 입력해주세요.");
      return;
    }
    if (!editForm.postcode.trim()) {
      toast.warning("우편번호를 입력해주세요.");
      return;
    }
    if (!editForm.address.trim()) {
      toast.warning("주소를 입력해주세요.");
      return;
    }

    try {
      const currentAddr = addressList.find((a) => a.address_id === addressIdx);

      // console.log("=== 수정 요청 데이터 ===");
      // console.log("userId:", userId);
      // console.log("addressIdx:", addressIdx);
      // console.log("addressList:", addressList);
      // console.log("currentAddr:", currentAddr);

      if (!currentAddr) {
        alert("주소를 찾을 수 없습니다.");
        return;
      }

      const requestBody = {
        addressIdx: addressIdx,
        nickname: editForm.nickname.trim(),
        postcode: editForm.postcode.trim(),
        roadAddress: editForm.address.trim(),
        detailAddress: editForm.detailAddress.trim(),
        isDefault: currentAddr?.is_default || false,
      };

      console.log("=== 수정 요청 body ===", requestBody);

      const res = await fetch("/api/user/address/updateAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("=== 수정 응답 status ===", res.status);

      const data = await res.json();
      console.log("=== 수정 응답 data ===", data);

      if (!res.ok || !data.success) {
        throw new Error(data.errorMessage || "수정 실패");
      }

      toast.success("주소가 수정되었습니다.");
      cancelEdit();
      fetchAddressList();
    } catch (err) {
      console.error("수정 에러:", err);
      alert(err.message || "주소 수정에 실패했습니다.");
    }
  };

  // 주소 삭제
  const deleteAddress = async (addressIdx) => {
    const idToken = await auth.currentUser.getIdToken();
    if (!userId || !addressIdx) {
      alert("userId 또는 addressIdx가 없습니다.");
      console.error("userId:", userId, "addressIdx:", addressIdx);
      return;
    }

    const targetAddr = addressList.find((a) => a.address_id === addressIdx);

    // console.log("=== 삭제 시도 ===");
    // console.log("userId:", userId);
    // console.log("addressIdx:", addressIdx);
    // console.log("찾은 주소:", targetAddr);
    // console.log("is_default 값:", targetAddr?.is_default);

    // is_default가 true인 경우만 삭제 불가
    if (targetAddr && targetAddr.is_default === true) {
      alert(
        "기본 배송지는 삭제할 수 없습니다.\n다른 주소를 기본으로 설정한 후 삭제해주세요."
      );
      return;
    }

    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      console.log("=== 삭제 API 호출 ===");
      const res = await fetch("/api/user/address/deleteAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          addressIdx: addressIdx,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.errorMessage);

      toast.success("주소가 삭제되었습니다.");
      fetchAddressList();
    } catch (err) {
      console.error(err);
      alert(err.message || "주소 삭제에 실패했습니다.");
    }
  };

  // 기본 배송지 설정
  const setDefaultAddress = async (addressIdx) => {
    const idToken = await auth.currentUser.getIdToken();
    if (!userId || !addressIdx) {
      alert("userId 또는 addressIdx가 없습니다.");
      console.error("userId:", userId, "addressIdx:", addressIdx);
      return;
    }

    try {
      const targetAddr = addressList.find((a) => a.address_id === addressIdx);

      // console.log("=== 기본 배송지 설정 시도 ===");
      // console.log("userId:", userId);
      // console.log("addressIdx:", addressIdx);
      // console.log("찾은 주소:", targetAddr);

      if (targetAddr?.is_default === true) {
        toast.warning("이미 기본 배송지입니다.");
        return;
      }

      const res = await fetch("/api/user/address/updateAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          addressIdx: addressIdx,
          nickname: targetAddr.nickname,
          postcode: targetAddr.postcode,
          roadAddress: targetAddr.road_address,
          detailAddress: targetAddr.detail_address || "",
          isDefault: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.errorMessage);

      toast.success("기본 배송지로 설정되었습니다.");
      fetchAddressList();
    } catch (err) {
      console.error(err);
      alert(err.message || "기본 배송지 설정에 실패했습니다.");
    }
  };

  // 새 주소 추가
  const addNewAddress = async () => {
    const idToken = await auth.currentUser.getIdToken();
    if (!newAddressForm.nickname.trim()) {
      toast.warning("주소 닉네임을 입력해주세요.");
      return;
    }
    if (!newAddressForm.postcode.trim()) {
      toast.warning("우편번호를 입력해주세요.\n'주소찾기' 버튼을 클릭하세요.");
      return;
    }
    if (!newAddressForm.address.trim()) {
      toast.warning("주소를 입력해주세요.\n'주소찾기' 버튼을 클릭하세요.");
      return;
    }

    try {
      const res = await fetch("/api/user/address/addAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          nickname: newAddressForm.nickname.trim(),
          postcode: newAddressForm.postcode.trim(),
          roadAddress: newAddressForm.address.trim(),
          detailAddress: newAddressForm.detailAddress.trim(),
          isDefault: false,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.errorMessage);

      toast.success("주소가 추가되었습니다.");
      setNewAddressForm({
        nickname: "",
        postcode: "",
        address: "",
        detailAddress: "",
      });
      fetchAddressList();
    } catch (err) {
      console.error(err);
      alert(err.message || "주소 추가에 실패했습니다.");
    }
  };

  // 우편번호 검색 (수정용)
  const handlePostcodeSearchForEdit = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert(
        "주소 검색 서비스를 불러오는 중입니다.\n잠시 후 다시 시도해주세요."
      );
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setEditForm((prev) => ({
          ...prev,
          postcode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

  // 우편번호 검색 (신규 추가용)
  const handlePostcodeSearchForNew = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert(
        "주소 검색 서비스를 불러오는 중입니다.\n잠시 후 다시 시도해주세요."
      );
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setNewAddressForm((prev) => ({
          ...prev,
          postcode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

  if (!userInfo) return <p>Loading...</p>;

  const defaultAddress = addressList.find((addr) => addr.is_default);
  const displayAddress = defaultAddress
    ? `${defaultAddress.road_address} ${defaultAddress.detail_address || ""}`
    : "등록된 배송지가 없습니다.";

  const fields = [
    { label: "이름", field: "name", value: userInfo.name },
    { label: "이메일", field: "email", value: userInfo.email },
    { label: "전화번호", field: "phone", value: userInfo.phone_number },
  ];

  return (
    <div className="flex w-full min-h-fit lg:pl-50">
      <div className="w-full max-w-5xl p-10 space-y-50">
        {/* 상단 정보 */}
        <div className="flex flex-col items-start justify-between border-b gap-15 py-50 md:flex-row md:items-center md:gap-0">
          <section className="flex items-center justify-between pb-6">
            <div>
              <h2 className="text-3xl font-semibold text-[#0A400C] mb-15">
                {userInfo.name}님
              </h2>
              <p className="mb-2 text-xl font-semibold text-black-900">
                나만의 서재를 채워보세요. 좋아하는 책을 발견해보세요!
              </p>
            </div>
          </section>
          {/* 나의 활동 */}
          <section>
            {/* <h3 className="mb-4 text-xl font-semibold">나의 활동</h3> */}
            <div className="flex gap-40 text-center mr-30">
              <div className="flex flex-col items-center justify-center gap-6 cursor-pointer">
                <p className="text-sm font-normal text-gray-500">주문 내역</p>
                <div className="flex items-center gap-8">
                  <FaBookOpen className="mx-auto text-2xl text-green-700" />
                  <p className="text-lg font-semibold">{orderCount}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 cursor-pointer">
                <p className="text-sm font-normal text-gray-500">찜한 도서</p>
                <div className="flex items-center gap-8">
                  <FaRegHeart className="mx-auto text-2xl text-pink-600" />
                  <p className="text-lg font-semibold">{wishlistCount}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 cursor-pointer">
                <p className="text-sm font-normal text-gray-500">리뷰 작성</p>

                <div className="flex items-center gap-8">
                  <FaGift className="mx-auto text-2xl text-yellow-600" />
                  <p className="text-lg font-semibold">{reviewCount}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* 기본 정보 */}
        <section className="mt-6 border-b pb-50">
          <h3 className="text-2xl font-semibold mb-30">기본 정보</h3>
          <div className="space-y-3 font-normal text-18">
            {fields.map(({ label, field, value }) => (
              <div key={field} className="flex items-center gap-20 mt-15">
                <p>
                  <b>{label} :</b> {value}
                </p>
                {field !== "email" && (
                  <button
                    className="text-sm px-8 py-3 border rounded-sm hover:bg-[var(--sub-color)] hover:text-white transition cursor-pointer"
                    onClick={() => {
                      setModalField(field);
                      setModalValue(value);
                      setModalOpen(true);
                    }}
                  >
                    수정
                  </button>
                )}
              </div>
            ))}

            {/* 배송주소 */}
            <div className="flex flex-col items-start gap-20 mt-10 md:flex-row md:items-center">
              <p>
                <b>배송주소 :</b> {displayAddress}
              </p>
              <button
                className="text-sm px-8 py-3 border rounded-sm hover:bg-[var(--sub-color)] hover:text-white transition cursor-pointer"
                onClick={openAddressModal}
              >
                배송주소 관리
              </button>
            </div>
          </div>
        </section>

        {/* 최근 본 도서 */}
        <section>
          <h3 className="text-2xl font-semibold mb-30">최근 본 도서</h3>

          {recentBooks.length === 0 ? (
            <p className="text-sm text-gray-500">최근 본 도서가 없습니다.</p>
          ) : (
            <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
              {recentBooks.slice(0, 4).map((book, index) => (
                <div
                  key={index}
                  className="border rounded-sm overflow-hidden hover:shadow-md transition cursor-pointer w-[180px]"
                  onClick={() =>
                    (window.location.href = `/product/detail/${book.book_id}`)
                  }
                >
                  <div className="relative w-full h-[250px]">
                    <Image
                      src={
                        book.image?.replace(/coversum/gi, "cover500") || noimg
                      }
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 250px, 180px"
                      className="object-cover"
                      priority={index < 2}
                    />
                  </div>
                  <div className="p-5 text-sm">
                    <p className="font-medium truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {book.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 개인 설정 */}
        <section>
          <h3 className="mb-4 text-xl font-semibold">개인 설정</h3>
          <button
            onClick={handleDeleteAccount}
            className="mt-6 text-sm font-light text-red-500 hover:underline"
          >
            회원 탈퇴하기
          </button>
        </section>
      </div>

      {/* 기본 수정 모달 */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={`${modalField} 수정`}
        confirmText="저장"
        cancelText="취소"
        onConfirm={updateUserField}
        onCancel={() => setModalOpen(false)}
        maxSize="max-w-md"
      >
        <input
          type="text"
          className="w-full p-10 border rounded-sm"
          value={modalValue}
          onChange={(e) => setModalValue(e.target.value)}
          autoFocus
        />
      </Modal>

      {/* 배송주소 관리 모달 */}
      <Modal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        title="배송주소 관리"
        maxSize="max-w-3xl"
        bodyClassName="max-h-[700px] overflow-y-auto"
      >
        <div className="space-y-10">
          {/* 기존 주소 목록 */}
          {addressList.length > 0 ? (
            addressList.map((addr) => {
              const isEditing = editingAddressIdx === addr.address_id;

              return (
                <div
                  key={addr.address_id}
                  className="space-y-3 border rounded-sm p-15 bg-gray-50"
                >
                  {isEditing ? (
                    // 수정 모드
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-5 text-sm font-medium text-gray-700">
                          주소 닉네임 <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="예: 집, 회사"
                          value={editForm.nickname}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              nickname: e.target.value,
                            }))
                          }
                          className="w-full p-10 border rounded-sm"
                        />
                      </div>
                      <AddressInput
                        postcode={editForm.postcode}
                        address={editForm.address}
                        detailAddress={editForm.detailAddress}
                        onDetailAddressChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            detailAddress: value,
                          }))
                        }
                        onPostcodeSearch={handlePostcodeSearchForEdit}
                      />
                      <div className="flex justify-end gap-5 mt-10">
                        <button
                          onClick={() => saveAddress(addr.address_id)}
                          className="px-12 py-6 bg-[var(--sub-color)] text-white rounded-sm hover:opacity-80 cursor-pointer"
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-12 py-6 text-gray-700 bg-gray-300 rounded-sm cursor-pointer hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 보기 모드
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-8 mb-6">
                          <span className="text-lg font-semibold">
                            {addr.nickname}
                          </span>
                          {addr.is_default && (
                            <span className="px-8 py-3 text-xs bg-[var(--sub-color)] text-white rounded">
                              기본
                            </span>
                          )}
                        </div>
                        <p className="mb-5 text-sm font-normal text-gray-600">
                          [{addr.postcode}] {addr.road_address}
                        </p>
                        {addr.detail_address && (
                          <p className="text-sm font-normal text-gray-600">
                            {addr.detail_address}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!addr.is_default && (
                          <button
                            onClick={() => setDefaultAddress(addr.address_id)}
                            className="text-sm font-light px-8 py-3 border rounded-sm hover:bg-[var(--main-color)]  hover:text-white transition cursor-pointer"
                          >
                            기본설정
                          </button>
                        )}
                        <button
                          onClick={() => startEditAddress(addr)}
                          className="text-sm font-light px-8 py-3 border rounded-sm hover:bg-[var(--sub-color)] hover:text-white transition cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.address_id)}
                          className="px-8 py-3 text-sm font-light transition border rounded-sm cursor-pointer hover:bg-red-600 hover:text-white"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="py-6 text-center text-gray-500">
              등록된 배송지가 없습니다.
            </p>
          )}

          {/* 새 주소 추가 */}
          {editingAddressIdx === null && (
            <div className="px-10 pt-20">
              <h4 className="mb-10 font-semibold text-md">새 배송지 추가</h4>
              <div className="space-y-3">
                <div>
                  <label className="block my-5 text-sm font-medium text-gray-700">
                    주소 닉네임 <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="예: 집, 회사"
                    value={newAddressForm.nickname}
                    onChange={(e) =>
                      setNewAddressForm((prev) => ({
                        ...prev,
                        nickname: e.target.value,
                      }))
                    }
                    className="w-full p-10 border rounded-sm"
                  />
                </div>
                <AddressInput
                  postcode={newAddressForm.postcode}
                  address={newAddressForm.address}
                  detailAddress={newAddressForm.detailAddress}
                  onDetailAddressChange={(value) =>
                    setNewAddressForm((prev) => ({
                      ...prev,
                      detailAddress: value,
                    }))
                  }
                  onPostcodeSearch={handlePostcodeSearchForNew}
                />
                <button
                  onClick={addNewAddress}
                  className="w-full py-15 bg-[var(--main-color)] font-normal text-white rounded-sm hover:opacity-80 transition cursor-pointer"
                >
                  주소 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
