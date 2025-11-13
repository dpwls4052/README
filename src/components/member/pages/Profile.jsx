"use client";

import { FaBookOpen, FaGift, FaRegHeart, FaUserEdit, FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";



export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
  async function fetchUser() {
    const auth = getAuth();
    const firestore = getFirestore();

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(firestore, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setUserInfo(snap.data());
    }
  }

  fetchUser();
  }, []);

  async function updateUserField(field, value) {
  const auth = getAuth();
  const firestore = getFirestore();
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(firestore, "users", user.uid);
  await updateDoc(ref, { [field]: value });

  setUserInfo((prev) => ({ ...prev, [field]: value }));
  setEditField(null);
}

const renderEditRow = (label, field) => (
  <div className="space-y-15 mt-3">
    <input
      className="w-full p-2 border rounded-md"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
    />
    <button
      onClick={() => updateUserField(field, editValue)}
      className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
    >
      저장
    </button>
  </div>
);


  return (
    <div className={`w-full min-h-fit py-10 flex justify-center `}>
      <div className={`w-full max-w-5xl rounded-xl shadow-md p-10 space-y-12 transition-all duration-300`}>

        {/* 1. 상단 회원 정보 */}
        <section className="flex justify-between items-center border-b pb-6">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#0A400C] mb-20">jhapoy106님</h2>
              <p className="text-black-900 font-semibold mb-10">
                나만의 서재를 채워보세요. 좋아하는 책을 발견해보세요!
              </p>
            </div>
          </div>
        </section>

        {/*  2. 기본 정보 */}
        <section className="grid col-span-3 gap-6 text-left">
          <div className="border rounded-lg py-30 pl-15 pr-15 mt-15">
            <h3 className="text-2xl font-semibold mb-30">기본 정보</h3>

            <div className="space-y-3 text-xl font-normal">


              <div className="flex justify-between items-center">
                <p className="mb-15"><b>이름 :</b> {userInfo?.name}</p>
                <button 
                onClick={() => {
                  if (editField === "name") {
                    setEditField(null);   // 이미 열려있으면 닫기
                  } else {
                    setEditField("name"); // 아니면 열기
                    setEditValue(userInfo?.name);
                  }
                }}
                className="text-sm px-3 py-1 border rounded-md hover:bg-green-600 hover:text-white transition">
                  이름 수정
                </button>
              </div>
              {editField === "name" && renderEditRow("이름", "name")}
              {/* {ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ} */}

              <div className="flex justify-between items-center">
                <p className="mb-15 mt-15"><b>이메일 :</b> {userInfo?.email}</p>
                <button 
                onClick={() => {
                  if (editField === "email") {
                    setEditField(null);   // 이미 열려있으면 닫기
                  } else {
                    setEditField("email"); // 아니면 열기
                    setEditValue(userInfo?.name);
                  }
                }}
                className="text-sm px-3 py-1 border rounded-md hover:bg-green-600 hover:text-white transition">
                  이메일 수정
                </button>
              </div>
              {editField === "email" && renderEditRow("이메일", "email")}
              {/* {ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ} */}

              <div className="flex justify-between items-center">
                <p className="mb-15 mt-15"><b>전화번호 :</b> {userInfo?.phone}</p>
                <button 
                onClick={() => {
                  if (editField === "phone") {
                    setEditField(null);   // 이미 열려있으면 닫기
                  } else {
                    setEditField("phone"); // 아니면 열기
                    setEditValue(userInfo?.name);
                  }
                }}
                className="text-sm px-3 py-1 border rounded-md hover:bg-green-600 hover:text-white transition">
                  전화번호 수정
                </button>
              </div>
              {editField === "phone" && renderEditRow("전화번호", "phone")}          
              {/* {ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ} */}

              <div className="flex justify-between items-center">
                <p className="mb-15 mt-15"><b>배송주소 :</b> {userInfo?.address}</p>
                <button 
                onClick={() => {
                  if (editField === "address") {
                    setEditField(null);   // 이미 열려있으면 닫기
                  } else {
                    setEditField("address"); // 아니면 열기
                    setEditValue(userInfo?.address);
                  }
                }}
                className="text-sm px-3 py-1 border rounded-md hover:bg-green-600 hover:text-white transition">
                  배송주소 수정
                </button>
              </div>
              {editField === "address" && renderEditRow("전화번호", "address")}          
              {/* {ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ} */}
            </div>
          </div>
        </section>

        {/* 3. 나의 활동 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">나의 활동</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaBookOpen className="mx-auto text-2xl text-green-700 dark:text-green-200 mb-2" />
              <p className="text-lg font-semibold">5</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">주문 내역</p>
            </div>
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaRegHeart className="mx-auto text-2xl text-pink-600 dark:text-pink-300 mb-2" />
              <p className="text-lg font-semibold">8</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">찜한 도서</p>
            </div>
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaGift className="mx-auto text-2xl text-yellow-600 dark:text-yellow-300 mb-2" />
              <p className="text-lg font-semibold">3</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">리뷰 작성</p>
            </div>
          </div>
        </section>

        {/* 4. 최근 본 도서 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">최근 본 도서</h3>
          <div className="grid grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                <img src={`https://placehold.co/200x250?text=Book+${i}`} alt={`Book ${i}`} />
                <div className="p-3 text-sm">
                  <p className="font-medium">인기 도서 {i}</p>
                  <p className="text-gray-500 dark:text-gray-300">저자 이름</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 개인 설정 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">개인 설정</h3>
          <button className="mt-6 text-sm text-red-500 hover:underline">
            회원 탈퇴하기
          </button>
        </section>
      </div>
    </div>
  );
}
