"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * useTab - URL 쿼리와 탭 상태 동기화
 * URL 쿼리와 동기화하며, 잘못된 값은 첫 번째 탭으로 초기화
 *
 * @param {string} key - URL 쿼리 파라미터 키
 * @param {string[]} tabList - 탭 구분 문자열 배열
 * @returns {object} { tabIndex, handleClickTab }
 */
export const useTab = (key, tabList) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabIndex = useMemo(() => {
    const currentKey = searchParams.get(key);
    const index = tabList.indexOf(currentKey ?? "");
    return index !== -1 ? index : 0;
  }, [searchParams, key, tabList]);

  useEffect(() => {
    const currentKey = searchParams.get(key);
    if (!currentKey || !tabList.includes(currentKey)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, tabList[0]);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, key, tabList, router]);

  const handleClickTab = useCallback(
    (index) => {
      const tabKey = tabList[index];
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, tabKey);
      router.replace(`?${params.toString()}`);
    },
    [searchParams, key, tabList, router]
  );

  return { tabIndex, handleClickTab };
};
