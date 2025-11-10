// src/features/Main/index.jsx
import Navigation from "@/components/main/Navigation";
import Banner from "@/components/main/Banner";
import Bestseller from "@/components/main/Bestseller";
import Recommend from "@/components/main/Recommend";

export default function Main() {
  return (
    <div className=" flex flex-col items-center text-center">
      <div className="max-w-[1200px] flex flex-col items-center text-center">
        <Navigation />
        <Banner />
        <Bestseller />
        <Recommend />
      </div>
    </div>
  );
}
