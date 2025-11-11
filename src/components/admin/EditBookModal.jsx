"use client";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Modal from "../common/Modal";
import Image from "next/image";
import { useModal } from "@/hooks/common/useModal";

const EditBookModal = ({ book, handleUpdateBook }) => {
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

  return (
    <>
      <button
        className="flex-1 bg-(--main-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
        onClick={handleOpenModal}
      >
        편집
      </button>
      <Modal
        title="도서 편집"
        open={isModalOpen}
        onOpenChange={toggleModal}
        confirmText="저장"
        cancelText="취소"
        onConfirm={handleSave}
        onCancel={handleCancel}
        maxSize="max-w-2xl"
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
          <div className="flex flex-col justify-between flex-1 h-full text-start">
            <div className="flex flex-col items-start gap-5">
              <p className="text-18">{book.title}</p>
              <p className="text-14">{book.author}</p>
              <p className="text-18">{book.priceStandard}원</p>
            </div>

            {/* 재고 수량 조절 */}
            <div className="flex items-center justify-end gap-10">
              재고
              <div className="flex gap-0 h-36 border border-[#cccccc] items-center rounded-md">
                <button
                  onClick={() => setStock((prev) => prev - 1)}
                  className="flex items-center justify-center w-36 h-36 shrink-0 hover:cursor-pointer border-r border-r-[#eeeeee]"
                >
                  <FaMinus className="w-12 h-12" />
                </button>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="h-full text-center w-80 outline-0"
                />
                <button
                  onClick={() => setStock((prev) => prev + 1)}
                  className="flex items-center justify-center w-36 h-36 shrink-0 hover:cursor-pointer border-l border-l-[#eeeeee]"
                >
                  <FaPlus className="w-12 h-12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditBookModal;
