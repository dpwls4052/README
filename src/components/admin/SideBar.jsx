import { ADMIN_TAB } from "@/constants/adminMenu";

const SideBar = ({ tabIndex, handleClickTab }) => {
  return (
    <>
      {/* 데스크톱: 세로 사이드바 (768px 이상) */}
      <aside className="sticky hidden h-full bg-(--main-color) md:block w-240 rounded-xl shrink-0">
        <div className="p-10">
          {ADMIN_TAB.map((tab, idx) => (
            <div
              key={tab.value}
              onClick={() => handleClickTab(idx)}
              className={`flex items-center justify-center w-full h-50 text-white ${
                tabIndex === idx && "bg-[#FFFFFF50] font-bold"
              } rounded-lg hover:cursor-pointer mb-2`}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </aside>

      {/* 모바일: 가로 탭바 (768px 미만) */}
      <div className="w-full bg-(--main-color) md:hidden rounded-xl shrink-0">
        <div className="flex gap-2 p-5 overflow-x-auto">
          {ADMIN_TAB.map((tab, idx) => (
            <div
              key={tab.value}
              onClick={() => handleClickTab(idx)}
              className={`flex items-center justify-center px-10 py-10 text-white whitespace-nowrap ${
                tabIndex === idx && "bg-[#FFFFFF50] font-bold"
              } rounded-lg hover:cursor-pointer`}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
