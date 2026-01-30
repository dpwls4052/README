"use client";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import Image from "next/image";
import { useModal } from "@/hooks/common/useModal";
import QuantityStepper from "@/components/common/QuantityStepper";

const EditBookModal = ({ book, handleUpdateBook }) => {
  const [stock, setStock] = useState(book.stock);
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

  const handleOpenModal = () => {
    setStock(book.stock);
    openModal();
  };
  const handleSave = () => {
    handleUpdateBook(book.bookId, { stock: Number(stock) });
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
        <div className="flex items-start gap-10 h-160">
          {/* 왼쪽 이미지 */}
          <Image
            src={book.cover}
            alt={book.title}
            width={100}
            height={160}
            className="rounded-md"
          />

          {/* 오른쪽 책 정보 */}
          <div className="flex-1">
            <p className="text-18">{book.title}</p>
            <p className="mt-5 text-14">{book.author}</p>
            <p className="mt-10 text-18">{book.priceStandard}원</p>

            {/* 재고 수량 조절 */}
            <div className="inline-block mt-10">
              <QuantityStepper value={stock} onChange={setStock} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditBookModal;
