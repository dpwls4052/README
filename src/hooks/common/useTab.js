/**
 * useTab - URL 쿼리와 탭 상태 동기화
 * URL 쿼리와 동기화하며, 잘못된 값은 첫 번째 탭으로 초기화
 *
 * @param {string} key - URL 쿼리 파라미터 키
 * @param {string[]} tabList - 탭 구분 문자열 배열
 * @returns {object} { tabIndex, handleClickTab }
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useTab = (key, tabList) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);
  // 초기 탭 상태 설정
  useEffect(() => {
    const currentKey = searchParams.get(key);
    const index = tabList.indexOf(currentKey);

    if (index !== -1) {
      setTabIndex(index);
    } else {
      // 잘못된 값이 들어왔을 경우 첫번째 탭으로 이동
      setSearchParams({ [key]: tabList[0] }, { replace: true });
      setTabIndex(0);
    }
  }, [searchParams, key, tabList, setSearchParams]);

  // 탭 변경 함수: 탭 클릭 시 URL과 내부 상태를 동시에 업데이트
  const handleClickTab = (index) => {
    const tabKey = tabList[index];
    setSearchParams({ [key]: tabKey });
    setTabIndex(index);
  };

  return { tabIndex, handleClickTab };
};
