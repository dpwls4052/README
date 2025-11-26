import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page");

  const aladinRes = await axios.get(
    "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx",
    {
      params: {
        TTBKey: process.env.NEXT_PUBLIC_ALADIN_KEY,
        Query: query,
        QueryType: "Title",
        Start: page,
        MaxResults: 10,
        Output: "js",
        Version: 20131101,
      },
    }
  );

  const data = aladinRes.data;
  const books = [];
  for (const book of data.item) {
    const bookData = {
      isbn: book.isbn13 || book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      categoryName: book.categoryName || "기타",
      pubDate: book.pubDate,
      priceStandard: book.priceStandard,
      priceSales: book.priceSales,
      cover: book.cover,
      description: book.description,
      link: book.link,
      mallType: book.mallType,
    };
    books.push(bookData);
  }

  const totalResults = Number(data.totalResults || 0);
  const startIndex = Number(data.startIndex || (page - 1) * 10 + 1);
  const hasNext = startIndex + 10 <= totalResults;

  return NextResponse.json({
    item: books,
    hasNext,
  });
}
