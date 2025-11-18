"use client";
import { useState } from "react";
import { useFindNewBooks } from "@/hooks/admin/useFindNewBooks";
import { useModal } from "@/hooks/common/useModal";
import Modal from "../common/Modal";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchSection from "./SearchSection";
import AddedSection from "./AddedSection";
import { useCreateBook } from "@/hooks/book/useCreateBook";

const AddBookModal = ({ fetchBooks }) => {
  const { searchBooks } = useFindNewBooks();
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
  const [aladinBookList, setAladinBookList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [addedBookList, setAddedBookList] = useState([]);

  const searchAladin = async () => {
    const res = await searchBooks(searchKey);
    setPage(1);
    setAladinBookList(res.item);
    setHasNext(res.hasNext);
  };
  const loadMore = async () => {
    const nextPage = page + 1;
    const res = await searchBooks(searchKey, nextPage);
    setAladinBookList((prev) => [...prev, ...res.item]);
    setPage(nextPage);
    setHasNext(res.hasNext);
  };

  const reset = () => {
    setAddedBookList([]);
    setAladinBookList([]);
    setSearchKey("");
    setPage(1);
    setHasNext(false);
  };

  const handleAddBook = (book) => {
    if (addedBookList.find((addedBook) => addedBook.isbn === book.isbn)) return;
    setAladinBookList((prev) =>
      prev.filter((aladinBook) => aladinBook.isbn !== book.isbn)
    );
    setAddedBookList((prev) => [{ ...book, stock: 1, salesCount: 0 }, ...prev]);
  };
  const handleDeleteBook = (book) => {
    setAladinBookList((prev) => [book, ...prev]);
    setAddedBookList((prev) =>
      prev.filter((addedBook) => addedBook.isbn !== book.isbn)
    );
  };

  const { addBook } = useCreateBook();

  const handleSaveBook = () => {
    addBook(addedBookList);
    fetchBooks(1, false);
    reset();
    closeModal();
  };

  return (
    <>
      <button
        className="shrink-0 bg-(--main-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
        onClick={openModal}
      >
        도서 추가
      </button>
      <Modal
        title="도서 추가"
        open={isModalOpen}
        onOpenChange={toggleModal}
        confirmText="저장"
        cancelText="취소"
        onConfirm={handleSaveBook}
        onCancel={closeModal}
        maxSize="max-w-full flex flex-col h-dvh"
        bodyClassName="overflow-y-auto"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center w-full h-50 px-20 mx-auto border border-(--main-color) rounded-full max-w-600 shrink-0 mt-10">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-full h-full outline-none"
            />
            <button className="hover:cursor-pointer" onClick={searchAladin}>
              <FaMagnifyingGlass className="stroke-(--main-color)" />
            </button>
          </div>

          <div className="flex h-full mt-20 overflow-hidden gap-30">
            <SearchSection
              aladinBookList={aladinBookList}
              hasNext={hasNext}
              loadMore={loadMore}
              handleAddBook={handleAddBook}
            />
            <AddedSection
              addedBookList={addedBookList}
              handleDeleteBook={handleDeleteBook}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddBookModal;
