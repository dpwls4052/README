import Image from "next/image";

const BookItem = ({ book, children }) => {
  return (
    <li className="flex flex-col px-20 py-10 border-b border-b-gray-200 shrink-0">
      <div className="flex items-start justify-start gap-10 h-100">
        <Image
          src={book.cover || "/no-image.png"}
          alt={book.title}
          width={62.5}
          height={100}
          className="rounded-md shrink-0"
        />
        <div className="flex-1 text-start">
          <p className="font-semibold line-clamp-2 leading-24">{book.title}</p>
          <p className="line-clamp-2 text-14">{book.author}</p>
        </div>
      </div>
      {children}
    </li>
  );
};

export default BookItem;
