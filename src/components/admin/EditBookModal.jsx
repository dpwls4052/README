"use client";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Modal from "../common/Modal";
import Image from "next/image";
import { useModal } from "@/hooks/common/useModal";

const EditBookModal = ({ book, handleUpdateBook, handleDeleteBook }) => {
  const [stock, setStock] = useState(book.stock);
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

  const handleOpenModal = () => {
    setStock(book.stock);
    openModal();
  };
  const handleSave = () => {
    handleUpdateBook(book.id, { stock: Number(stock) });
    closeModal();
  };
  const handleCancel = () => {
    setStock(book.stock);
    closeModal();
  };
  const handleDelete = () => {
    handleDeleteBook(book.id);
  };

  return (
    <>
      {/* 장바구니 모달 */}
      <Modal
        title="도서 편집"
        open={isModalOpen}
        onOpenChange={toggleModal}
        confirmText="저장"
        cancelText="취소"
        onConfirm={handleSave}
        onCancel={handleCancel}
        maxSize="max-w-lg"
      >
        <div className="flex items-center gap-10 h-160">
          {/* 왼쪽 이미지 */}
          <Image
            src={book.cover}
            alt={book.title}
            width={100}
            height={160}
            className="rounded-md"
          />

          {/* 오른쪽 책 정보 */}
          <div className="justify-between flex-1 h-full">
            <div className="flex flex-col items-start gap-5">
              <p className="text-base text-20">{book.title}</p>
              <p>{book.author}</p>
              <p className="text-18">{book.priceStandard}원</p>
            </div>

            {/* 재고 수량 조절 */}
            <div className="flex items-center justify-end gap-10">
              재고
              <div className="flex gap-0 h-50 border border-[#cccccc] items-center rounded-md">
                <button
                  onClick={() => setStock((prev) => prev - 1)}
                  className="flex items-center justify-center w-50 h-50 shrink-0 hover:cursor-pointer border-r border-r-[#eeeeee]"
                >
                  <FaMinus width={10} height={10} />
                </button>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-full text-center w-100 outline-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                />
                <button
                  onClick={() => setStock((prev) => prev + 1)}
                  className="flex items-center justify-center w-50 h-50 shrink-0 hover:cursor-pointer border-l border-l-[#eeeeee]"
                >
                  <FaPlus width={10} height={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <button
        className="flex-1 bg-(--sub-color) text-white py-2 rounded h-40 font-normal hover:cursor-pointer"
        onClick={handleOpenModal}
      >
        편집
      </button>
    </>
  );
};

export default EditBookModal;
