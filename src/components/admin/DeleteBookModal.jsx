"use client";

import Modal from "../common/Modal";
import { useModal } from "@/hooks/common/useModal";

const DeleteBookModal = ({ book, handleDeleteBook }) => {
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

  const handleDelete = () => {
    handleDeleteBook(book.id);
  };

  return (
    <>
      <button
        className="flex-1 bg-[#E5484D] text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
        onClick={openModal}
      >
        삭제
      </button>
      <Modal
        title="삭제하시겠습니까?"
        open={isModalOpen}
        onOpenChange={toggleModal}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={closeModal}
        maxSize="max-w-lg"
      >
        <p>{book.title}</p>
      </Modal>
    </>
  );
};

export default DeleteBookModal;
