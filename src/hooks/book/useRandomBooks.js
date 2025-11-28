"use client";

import { useEffect, useState } from "react";

/**
 * 문자열을 고정된 숫자 seed로 변환
 * - 같은 문자열이면 항상 같은 숫자
 */
function stringToSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0; // 32비트 정수 안에서 굴리기
  }
  return h >>> 0; // 음수를 unsigned로 변환
}

/**
 * 고정 seed 기반 의사 난수 생성기 (mulberry32)
 * - 같은 seed면 항상 같은 순서의 난수 스트림
 */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 결정적 셔플
 * - 같은 배열 + 같은 seed => 항상 같은 결과
 */
function shuffleDeterministic(array, seed) {
  const rng = mulberry32(seed);
  const arr = [...array]; // 원본 훼손 방지

  // Fisher-Yates 셔플
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * 추천/계절 도서용 훅
 *
 * 예)
 *   useRandomBooks({ enabled: true, type: "recommend" })
 *   useRandomBooks({ enabled: true, type: "season" })
 *
 * - /api/books/random 에서 전체 도서 목록을 가져오고
 * - type에 따라 seed를 달리해서 결정적 셔플 후
 * - 앞에서 10개만 잘라서 books로 제공
 * - 새로고침해도 결과가 안 바뀐다.
 */
export function useRandomBooks({ enabled = true, type } = {}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchRandomBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) 서버에서 전체 도서 목록 가져오기
        const res = await fetch("/api/books/random");

        if (!res.ok) {
          // 서버에서 넘겨준 에러 메시지를 그대로 보여주면 디버깅에 편함
          const text = await res.text();
          console.error("Random books API response:", res.status, text);
          throw new Error("추천/계절 도서 조회에 실패했습니다.");
        }

        const data = await res.json();
        const allBooks = data.books || [];

        // 2) type 기준으로 seed 결정
        //    - recommend / season / 기타
        const seedKey = type || "default"; // undefined 방지
        const seed = stringToSeed(seedKey);

        // 3) 결정적 셔플 + 앞에서 10개만 사용
        const shuffled = shuffleDeterministic(allBooks, seed);
        const selected = shuffled.slice(0, 10);

        setBooks(selected);
      } catch (err) {
        console.error("useRandomBooks error:", err);
        setError(err.message ?? "추천/계절 도서 조회 중 오류가 발생했습니다.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomBooks();
  }, [enabled, type]);

  return { books, loading, error };
}
