"use client";

import Modal from "@/components/common/Modal";
import { useModal } from "@/hooks/common/useModal";

const DeleteBookModal = ({ book, handleDeleteBook }) => {
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

  return (
    <>
      <button
        className="bg-[#E5484D] text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
        onClick={openModal}
      >
        판매 중지
      </button>
      <Modal
        title="판매 중지하시겠습니까?"
        open={isModalOpen}
        onOpenChange={toggleModal}
        confirmText="판매 중지"
        cancelText="취소"
        onConfirm={() => {
          handleDeleteBook(book.bookId);
          closeModal();
        }}
        onCancel={closeModal}
        maxSize="max-w-lg"
      >
        <p className="text-center">{book.title}</p>
      </Modal>
    </>
  );
};

export default DeleteBookModal;
