/**
 * Firestore에서 책 목록을 무한 스크롤(Infinite Scroll) 방식으로 불러오는 커스텀 훅입니다.
 * @param {object} options - 옵션 객체
 * @param {number} [options.pageSize=20] - 한 번에 불러올 문서의 개수
 * @param {string | null} [options.category=null] - 필터링할 카테고리
 * @param {string | null} [options.search=null] - 검색어 (title 기준 접두사 검색)
 * @param {string | null} [options.id=null] - 문서 ID (단일 도서 상세 검색용)
 * @param {string} [options.orderField="createdAt"] - 정렬 기준 필드
 * @param {("asc" | "desc")} [options.orderDirection="desc"] - 정렬 방향
 */
import { useEffect, useState, useCallback, useRef } from "react";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
    // Firestore 문서 ID를 쿼리하기 위한 __name__ 필드 참조는
    // 'firebase/firestore'에서 별도 import 없이 where 함수 내에서 문자열로 사용 가능
} from "firebase/firestore";
import { db } from "@/config/firebase";

export const useBookList = ({
    pageSize = 20,
    category = null,
    search = null,
    id = null, // 🚨 새로운 옵션: 단일 도서 ID
    orderField = "createdAt",
    orderDirection = "desc",
}) => {
    const [books, setBooks] = useState([]);

    // 마지막 문서 커서를 저장하는 ref
    const cursorRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);

    // 책 데이터를 불러오는 함수. reset 플래그를 통해 커서를 초기화
    const fetchBooks = useCallback(
        async (reset = false) => {
            // 중복 호출 방지
            if (loading) return;
            setLoading(true);

            // 다음 페이지가 없고 리셋이 아닐 경우, 함수 실행 중단
            if (!hasNext && !reset) {
                setLoading(false);
                return;
            }

            try {
                const ref = collection(db, "books");
                const queryConstraints = [];

                // 🚨 1. 단일 ID 검색 제약 조건 (최우선)
                // ID가 있다면, 다른 필터링 및 정렬을 무시하고 문서 ID(__name__)로 정확히 일치하는 문서 하나만 가져옵니다.
                if (id) {
                    queryConstraints.push(where("__name__", "==", id));
                    // 단일 문서 검색이므로 limit을 1로 설정
                    queryConstraints.push(limit(1)); 
                } 
                // 🚨 ID 검색이 아닐 경우 (목록 조회인 경우)
                else {
                    // 2. Where 제약 조건 (카테고리)
                    if (category) {
                        queryConstraints.push(where("category", "==", category));
                    }

                    // 3. 검색 제약 조건 (Title 접두사 검색)
                    if (search) {
                        queryConstraints.push(where("title", ">=", search));
                        queryConstraints.push(where("title", "<=", search + "\uf8ff"));
                        // 검색 시에도 정렬 필드를 지정해야 합니다. (Firestore 복합 인덱스 규칙)
                        queryConstraints.push(orderBy("title", "asc"));
                    } else {
                        // 검색이 없을 경우, 지정된 정렬 조건 사용
                        queryConstraints.push(orderBy(orderField, orderDirection));
                    }

                    // 4. 커서/Reset 제약 조건 (무한 스크롤 관련)
                    if (reset) {
                        cursorRef.current = null;
                    }

                    if (cursorRef.current) {
                        queryConstraints.push(startAfter(cursorRef.current));
                    }

                    // 5. Limit 제약 조건 (다음 페이지 존재 확인을 위해 `pageSize + 1`로 요청)
                    queryConstraints.push(limit(pageSize + 1));
                }
                
                // 🚨 ID 검색 시에는 무한 스크롤 관련 로직을 건너뛰도록 재구성함
                
                const q = query(ref, ...queryConstraints);
                const snapshot = await getDocs(q);

                // 문서 데이터 매핑 (doc.id는 Firestore 문서 ID입니다.)
                const fetchedDocs = snapshot.docs.map((doc) => ({
                    id: doc.id, // 👈 문서 ID를 'id' 필드에 저장
                    ...doc.data(),
                }));

                if (id) {
                    // 단일 ID 검색인 경우
                    setBooks(fetchedDocs);
                    setHasNext(false); // 다음 페이지 없음
                } else {
                    // 목록 검색 (무한 스크롤)인 경우
                    const hasMore = fetchedDocs.length > pageSize;

                    const visibleDocs = hasMore
                        ? fetchedDocs.slice(0, pageSize)
                        : fetchedDocs;

                    cursorRef.current =
                        visibleDocs.length > 0 ? snapshot.docs[visibleDocs.length - 1] : null;

                    setBooks((prev) => (reset ? visibleDocs : [...prev, ...visibleDocs]));
                    setHasNext(hasMore);
                }

            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        },
        [pageSize, category, search, id, orderField, orderDirection] // id를 종속성 배열에 추가
    );

    // 카테고리/검색/정렬/ID 조건이 변경될 때 데이터를 초기화하고 다시 불러오기
    useEffect(() => {
        // ID 검색 시에는 목록 상태 관리가 불필요하지만, 재검색은 필요
        setBooks([]);
        setHasNext(true);
        fetchBooks(true);
    }, [category, search, id, orderField, orderDirection, fetchBooks]); // id를 종속성 배열에 추가

    return { books, fetchBooks, loading, hasNext, setBooks };
};