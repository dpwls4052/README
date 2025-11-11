import { ADMIN_TAB } from "@/constants/adminMenu";

const SideBar = ({ tabIndex, handleClickTab }) => {
  return (
    <aside className="w-240 h-full bg-(--main-color) sticky rounded-xl shrink-0">
      <div className="p-10">
        {ADMIN_TAB.map((tab, idx) => (
          <div
            key={tab.value}
            onClick={() => handleClickTab(idx)}
            className={`flex items-center justify-center w-full h-50 text-white ${
              tabIndex === idx && "bg-[#FFFFFF50] text-bold"
            } rounded-lg hover:cursor-pointer`}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
