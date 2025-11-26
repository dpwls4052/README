"use client";
import { createContext, useContext, useState } from "react";

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [scrollContainerRef, setScrollContainerRef] = useState(null);

  return (
    <ScrollContext.Provider
      value={{ scrollContainerRef, setScrollContainerRef }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
