import Navigation from "@/components/main/Navigation";
import Banner from "@/components/main/Banner";
import Bestseller from "@/components/main/Bestseller";
import Recommend from "@/components/main/Recommend";

export default function Main() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex flex-col items-center w-full px-20 text-center max-w-1200">
        <Navigation />
        <Banner />
        <Bestseller />
        <Recommend />
      </div>
    </div>
  );
}
